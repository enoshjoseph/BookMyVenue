namespace BookMyVenue.Core.Entities;

public class VenueImage
{
    public Guid Id { get; set;} = Guid.NewGuid();
    public Guid VenueId { get; set;}
    public String ImageUrl { get; set; } = String.Empty;
    public bool IsPrimary {get; set; } = false;
    public Venue Venue { get; set; } = null!;
}