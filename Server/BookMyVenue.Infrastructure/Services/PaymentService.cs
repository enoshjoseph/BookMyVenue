using BookMyVenue.Core.DTOs.Payment;
using BookMyVenue.Core.Entities;
using BookMyVenue.Core.Enums;
using BookMyVenue.Core.Interfaces.Repositories;
using BookMyVenue.Core.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Security.Cryptography;
using System.Text;

namespace BookMyVenue.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepo;
    private readonly IBookingRepository _bookingRepo;
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public PaymentService(IBookingRepository bookingRepo, IPaymentRepository paymentRepo, IConfiguration config, HttpClient httpClient)
    {
        _bookingRepo = bookingRepo;
        _paymentRepo = paymentRepo;
        _config = config;
        _httpClient = httpClient;
    }   

    public async Task<PaymentOrderDto> CreatePaymentOrderAsync(Guid bookingId, Guid userId)
    {
        var booking = await _bookingRepo.GetByIdAsync(bookingId)
            ?? throw new Exception("Booking not found.");

        if (booking.UserId != userId)
            throw new Exception("Unauthorized.");

        var paymentType = booking.PaymentStatus == PaymentStatus.PartiallyPaid
            ? PaymentType.Balance
            : (booking.Venue.IsAdvanceRequired ? PaymentType.Advance : PaymentType.Full);

        var amount = paymentType switch
        {
            PaymentType.Balance => booking.BalanceAmount,
            PaymentType.Full    => booking.TotalAmount,
            _                   => booking.AdvanceAmount
        };

        // Real Razorpay order
        var keyId = Environment.GetEnvironmentVariable("RAZORPAY_KEY_ID");
        var keySecret = Environment.GetEnvironmentVariable("RAZORPAY_KEY_SECRET");
        var auth =
        Convert.ToBase64String(
            Encoding.UTF8.GetBytes($"{keyId}:{keySecret}"));

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", auth);
        
        var request = new
        {
            amount = (int)(amount * 100),
            currency = "INR",
            receipt = bookingId.ToString()
        };

        var json = JsonSerializer.Serialize(request);

        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("https://api.razorpay.com/v1/orders",content);
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception(error);
        }

        var responseBody = await response.Content.ReadAsStringAsync();

        var jsonObject = JsonNode.Parse(responseBody);

        var razorpayOrderId =
            jsonObject?["id"]?.ToString();  

        var payment = new Payment
        {
            BookingId = bookingId,
            PaymentType = paymentType,
            Amount = amount,
            Status = PaymentTransactionStatus.Pending,
            DueDate = paymentType == PaymentType.Balance ? booking.BalanceDueDate : null,
            TransactionRef = razorpayOrderId
        };

        await _paymentRepo.AddAsync(payment);
        await _paymentRepo.SaveChangesAsync();

        return new PaymentOrderDto
        {
            RazorpayOrderId = razorpayOrderId!,
            Amount = amount,
            Currency = "INR",
            PaymentType = paymentType.ToString()
        };
    }

   public async Task VerifyAndConfirmPaymentAsync(PaymentVerifyDto dto)
    {
        // Get Razorpay Secret
        var keySecret = Environment.GetEnvironmentVariable("RAZORPAY_KEY_SECRET")
            ?? throw new Exception("Razorpay secret key not configured.");

        // Razorpay generates signature using:
        // HMAC_SHA256(order_id + "|" + payment_id, secret)
        var payload = $"{dto.RazorpayOrderId}|{dto.RazorpayPaymentId}";

        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(keySecret));

        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));

        var generatedSignature = Convert.ToHexString(hash).ToLowerInvariant();

        // Compare signatures
        if (!generatedSignature.Equals(dto.RazorpaySignature, StringComparison.OrdinalIgnoreCase))
        {
            throw new Exception("Invalid payment signature. Payment verification failed.");
        }

        // Fetch Booking
        var booking = await _bookingRepo.GetByIdAsync(dto.BookingId)
            ?? throw new Exception("Booking not found.");

        // Fetch Pending Payment
        var payments = await _paymentRepo.GetByBookingIdAsync(dto.BookingId);

        var pendingPayment = payments.FirstOrDefault(p =>
            p.TransactionRef == dto.RazorpayOrderId &&
            p.Status == PaymentTransactionStatus.Pending)
            ?? throw new Exception("Payment record not found.");

        // Update Payment
        pendingPayment.Status = PaymentTransactionStatus.Paid;
        pendingPayment.PaidAt = DateTime.UtcNow;

        // Store Razorpay Payment Id
        pendingPayment.TransactionRef = dto.RazorpayPaymentId;

        await _paymentRepo.UpdateAsync(pendingPayment);

        // Update Booking
        if (pendingPayment.PaymentType == PaymentType.Advance)
        {
            booking.PaymentStatus = PaymentStatus.PartiallyPaid;
        }
        else
        {
            booking.PaymentStatus = PaymentStatus.FullyPaid;
            booking.Status = BookingStatus.Confirmed;
        }

        await _bookingRepo.UpdateAsync(booking);

        // Save
        await _bookingRepo.SaveChangesAsync();
    }
}