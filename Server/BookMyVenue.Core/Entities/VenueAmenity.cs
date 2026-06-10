namespace BookMyVenue.Core.Entities;

public class VenueAmenity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid VenueId { get; set; }
    public string Name { get; set; } = string.Empty;

    // Navigation property
    public Venue Venue { get; set; } = null!;
}