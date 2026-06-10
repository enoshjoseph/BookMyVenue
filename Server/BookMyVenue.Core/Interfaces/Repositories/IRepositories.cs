using BookMyVenue.Core.Entities;

namespace BookMyVenue.Core.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllAsync();
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task SaveChangesAsync();
}

public interface IVenueRepository
{
    Task<Venue?> GetByIdAsync(Guid id);
    Task<IEnumerable<Venue>> GetAllApprovedAsync();
    Task<IEnumerable<Venue>> GetByOwnerIdAsync(Guid ownerId);
    Task<IEnumerable<Venue>> SearchAsync(string? city, string? type, int? capacity, decimal? maxPrice);
    Task AddAsync(Venue venue);
    Task UpdateAsync(Venue venue);
    Task SaveChangesAsync();
}

public interface IBookingRepository
{
    Task<Booking?> GetByIdAsync(Guid id);
    Task<IEnumerable<Booking>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Booking>> GetByVenueIdAsync(Guid venueId);
    Task<bool> IsVenueAvailableAsync(Guid venueId, DateOnly startDate, DateOnly endDate);
    Task AddAsync(Booking booking);
    Task UpdateAsync(Booking booking);
    Task SaveChangesAsync();
}

public interface IPaymentRepository
{
    Task<Payment?> GetByIdAsync(Guid id);
    Task<IEnumerable<Payment>> GetByBookingIdAsync(Guid bookingId);
    Task AddAsync(Payment payment);
    Task UpdateAsync(Payment payment);
    Task SaveChangesAsync();
}