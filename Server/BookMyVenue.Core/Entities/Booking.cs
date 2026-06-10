using BookMyVenue.Core.Enums;

namespace BookMyVenue.Core.Entities;

public class Booking : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid VenueId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal AdvanceAmount { get; set; }
    public decimal BalanceAmount { get; set; }
    public DateOnly? BalanceDueDate { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    // Navigation properties
    public User User { get; set; } = null!;
    public Venue Venue { get; set; } = null!;
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}