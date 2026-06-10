namespace BookMyVenue.Core.DTOs.Booking;

public class CreateBookingDto
{
    public Guid VenueId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}

public class BookingResponseDto
{
    public Guid Id { get; set; }
    public Guid VenueId { get; set; }
    public string VenueName { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal AdvanceAmount { get; set; }
    public decimal BalanceAmount { get; set; }
    public DateOnly? BalanceDueDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}