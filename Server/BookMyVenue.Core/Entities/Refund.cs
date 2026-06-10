using BookMyVenue.Core.Enums;

namespace BookMyVenue.Core.Entities;

public class Refund
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PaymentId { get; set; }
    public decimal Amount { get; set; }
    public RefundStatus Status { get; set; } = RefundStatus.Requested;
    public string? Reason { get; set; }
    public DateTime? RefundedAt { get; set; }

    // Navigation property
    public Payment Payment { get; set; } = null!;
}