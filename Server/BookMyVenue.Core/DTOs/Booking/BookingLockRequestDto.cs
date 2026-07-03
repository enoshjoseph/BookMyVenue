namespace BookMyVenue.Core.DTOs.Booking;

public class BookingLockRequestDto
{
    public Guid VenueId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }
}