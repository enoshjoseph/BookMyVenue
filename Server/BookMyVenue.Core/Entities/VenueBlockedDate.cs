using BookMyVenue.Core.Enums;

namespace BookMyVenue.Core.Entities;

public class VenueBlockedDate
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid VenueId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public BlockedReason BlockedReason { get; set; } = BlockedReason.Other;
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }

    // Navigation property
    public Venue Venue { get; set; } = null!;
}