using BookMyVenue.Core.Enums;

namespace BookMyVenue.Core.Entities;

public class Venue : BaseEntity
{
    public Guid OwnerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public decimal PricePerDay { get; set; }
    public int Capacity { get; set; }
    public VenueStatus Status { get; set; } = VenueStatus.Pending;
    public DateOnly AvailableFrom { get; set; }
    public DateOnly AvailableTo { get; set; }

    // Payment policy
    public bool IsAdvanceRequired { get; set; } = false;
    public decimal? AdvancePercentage { get; set; }
    public int? BalanceDueDaysBeforeEvent { get; set; }

    // Cancellation policy
    public bool IsCancellationAllowed { get; set; } = false;
    public int? CancellationDeadlineDays { get; set; }

    // Navigation properties
    public VenueOwnerProfile Owner { get; set; } = null!;
    public ICollection<VenueImage> Images { get; set; } = new List<VenueImage>();
    public ICollection<VenueAmenity> Amenities { get; set; } = new List<VenueAmenity>();
    public ICollection<VenueBlockedDate> BlockedDates { get; set; } = new List<VenueBlockedDate>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}