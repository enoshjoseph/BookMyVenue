namespace BookMyVenue.Core.Entities;

public class VenueOwnerProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public string BusinessName { get; set; } = string.Empty;
    public string? BusinessAddress { get; set; }
    public string? PanNumber { get; set; }
    public bool IsVerified { get; set; } = false;

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<Venue> Venues { get; set; } = new List<Venue>();
}