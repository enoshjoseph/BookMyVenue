using BookMyVenue.Core.Enums;

namespace BookMyVenue.Core.Entities;

public class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public UserRole Role { get; set; } = UserRole.User;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public VenueOwnerProfile? OwnerProfile { get; set; }
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}