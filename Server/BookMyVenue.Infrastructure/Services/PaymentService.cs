using BookMyVenue.Core.DTOs.Payment;
using BookMyVenue.Core.Entities;
using BookMyVenue.Core.Enums;
using BookMyVenue.Core.Interfaces.Repositories;
using BookMyVenue.Core.Interfaces.Services;
using Microsoft.Extensions.Configuration;

namespace BookMyVenue.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepo;
    private readonly IBookingRepository _bookingRepo;
    private readonly IConfiguration _config;

    public PaymentService(IBookingRepository bookingRepo, IPaymentRepository paymentRepo, IConfiguration config)
    {
        _bookingRepo = bookingRepo;
        _paymentRepo = paymentRepo;
        _config = config;
    }

    public async Task<PaymentOrderDto>CreatePaymentOrderAsync(Guid bookingId, Guid userId)
    {
        var booking = await _bookingRepo.GetByIdAsync(bookingId) ?? throw new Exception("Booking not found");

        if (booking.UserId != userId)
            throw new Exception("Unauthorized");

        var paymentType = booking.PaymentStatus == PaymentStatus.PartiallyPaid
            ? PaymentType.Balance
            : (booking.Venue.IsAdvanceRequired ? PaymentType.Advance : PaymentType.Full);

        var amount = paymentType switch
        {
            PaymentType.Balance => booking.BalanceAmount,
            PaymentType.Full => booking.TotalAmount,
            _                  => booking.AdvanceAmount
        };
        var simulatedOrderId = $"order_sim_{Guid.NewGuid():N}";

        var payment = new Payment
        {
            BookingId = bookingId,
            PaymentType = paymentType,
            Amount = amount,
            Status = PaymentTransactionStatus.Pending,
            DueDate = paymentType == PaymentType.Balance ? booking.BalanceDueDate : null,
            TransactionRef = simulatedOrderId
        };

        await _paymentRepo.AddAsync(payment);
        await _paymentRepo.SaveChangesAsync();

        return new PaymentOrderDto
        {
            RazorpayOrderId = simulatedOrderId,
            Amount = amount,
            Currency = "INR",
            PaymentType = paymentType.ToString()

        };
    }

    public async Task VerifyAndConfirmPaymentAsync(PaymentVerifyDto dto)
    {
        var booking = await _bookingRepo.GetByIdAsync(dto.BookingId)
            ?? throw new Exception("Booking not found.");

        var payments = await _paymentRepo.GetByBookingIdAsync(dto.BookingId);
        var pendingPayment = payments.FirstOrDefault(p =>
            p.TransactionRef == dto.RazorpayOrderId &&
            p.Status == PaymentTransactionStatus.Pending)
            ?? throw new Exception("Payment record not found.");

        // Mark payment as paid
        pendingPayment.Status = PaymentTransactionStatus.Paid;
        pendingPayment.PaidAt = DateTime.UtcNow;
        pendingPayment.TransactionRef = dto.RazorpayPaymentId;
        await _paymentRepo.UpdateAsync(pendingPayment);

        // Update booking payment status
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
        await _bookingRepo.SaveChangesAsync();
    }
}

