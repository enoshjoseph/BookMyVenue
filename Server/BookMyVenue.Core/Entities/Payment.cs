using BookMyVenue.Core.Enums;

namespace BookMyVenue.Core.Entities;

public class Payment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public PaymentType PaymentType { get; set; }
    public decimal Amount { get; set; }
    public PaymentTransactionStatus Status { get; set; } = PaymentTransactionStatus.Pending;
    public string Method { get; set; } = "Razorpay";
    public string? TransactionRef { get; set; }
    public DateOnly? DueDate { get; set; }
    public DateTime? PaidAt { get; set; }

    // Navigation properties
    public Booking Booking { get; set; } = null!;
    public Refund? Refund { get; set; }
}