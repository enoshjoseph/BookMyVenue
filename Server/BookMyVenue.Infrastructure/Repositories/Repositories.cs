using BookMyVenue.Core.Entities;
using BookMyVenue.Core.Interfaces.Repositories;
using BookMyVenue.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using BookMyVenue.Core.Enums;

namespace BookMyVenue.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;

    public UserRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<User?> GetByIdAsync(Guid id) =>
        await _db.Users.Include(u => u.OwnerProfile).FirstOrDefaultAsync(u => u.Id == id);

    public async Task<User?> GetByEmailAsync(string email) =>
        await _db.Users.Include(u => u.OwnerProfile).FirstOrDefaultAsync(u => u.Email == email);

    public async Task<IEnumerable<User>> GetAllAsync() =>
        await _db.Users.Include(u => u.OwnerProfile).ToListAsync();

    public async Task AddAsync(User user) =>
        await _db.Users.AddAsync(user);

    public Task UpdateAsync(User user)
    {
        _db.Users.Update(user);
        return Task.CompletedTask;
    }
    public async Task SaveChangesAsync() =>
        await _db.SaveChangesAsync();
}

public class VenueRepository : IVenueRepository
{
    private readonly AppDbContext _db;

    public VenueRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Venue?> GetByIdAsync(Guid id) =>
        await _db.Venues
            .Include(v => v.Images)
            .Include(v => v.Amenities)
            .Include(v => v.BlockedDates)
            .Include(v => v.Owner)
            .FirstOrDefaultAsync(v => v.Id == id);

    public async Task<IEnumerable<Venue>> GetAllApprovedAsync() =>
        await _db.Venues
            .Include(v => v.Images)
            .Include(v => v.Amenities)
            .Where(v => v.Status == VenueStatus.Approved)
            .ToListAsync();

    public async Task<IEnumerable<Venue>> GetByOwnerIdAsync(Guid ownerId) =>
        await _db.Venues
            .Include(v => v.Images)
            .Include(v => v.Amenities)
            .Include(v => v.BlockedDates)
            .Where(v => v.OwnerId == ownerId)
            .ToListAsync();

    public async Task<IEnumerable<Venue>> SearchAsync(string? city, string? type, int? capacity, decimal? maxPrice)
    {
        var query = _db.Venues
            .Include(v => v.Images)
            .Include(v => v.Amenities)
            .Where(v => v.Status == VenueStatus.Approved);

        if (!string.IsNullOrEmpty(city))
            query = query.Where(v => v.City.ToLower().Contains(city.ToLower()));

        if (!string.IsNullOrEmpty(type))
            query = query.Where(v => v.Type.ToLower() == type.ToLower());

        if (capacity.HasValue)
            query = query.Where(v => v.Capacity >= capacity.Value);

        if (maxPrice.HasValue)
            query = query.Where(v => v.PricePerDay <= maxPrice.Value);

        return await query.ToListAsync();
    }

    public async Task AddAsync(Venue venue) =>
        await _db.Venues.AddAsync(venue);

    public Task UpdateAsync(Venue venue)
    {
        _db.Venues.Update(venue);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() =>
        await _db.SaveChangesAsync();
}

public class BookingRepository : IBookingRepository
{
    private readonly AppDbContext _db;

    public BookingRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Booking?> GetByIdAsync(Guid id) =>
        await _db.Bookings
            .Include(b => b.Venue)
            .Include(b => b.Payments)
            .FirstOrDefaultAsync(b => b.Id == id);

    public async Task<IEnumerable<Booking>> GetByUserIdAsync(Guid userId) =>
        await _db.Bookings
            .Include(b => b.Venue)
            .Include(b => b.Payments)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

    public async Task<IEnumerable<Booking>> GetByVenueIdAsync(Guid venueId) =>
        await _db.Bookings
            .Include(b => b.User)
            .Include(b => b.Payments)
            .Where(b => b.VenueId == venueId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

    public async Task<bool> IsVenueAvailableAsync(Guid venueId, DateOnly startDate, DateOnly endDate)
    {
        var hasBooking = await _db.Bookings.AnyAsync(b =>
            b.VenueId == venueId &&
            b.Status != BookingStatus.Cancelled &&
            b.StartDate <= endDate &&
            b.EndDate >= startDate);

        if (hasBooking) return false;

        var hasBlockedDate = await _db.VenueBlockedDates.AnyAsync(b =>
            b.VenueId == venueId &&
            b.StartDate <= endDate &&
            b.EndDate >= startDate);

        return !hasBlockedDate;
    }

    public async Task AddAsync(Booking booking) =>
        await _db.Bookings.AddAsync(booking);

    public Task UpdateAsync(Booking booking)
    {
        _db.Bookings.Update(booking);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() =>
        await _db.SaveChangesAsync();
}

public class PaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _db;

    public PaymentRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Payment?> GetByIdAsync(Guid id) =>
        await _db.Payments
            .Include(p => p.Refund)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<IEnumerable<Payment>> GetByBookingIdAsync(Guid bookingId) =>
        await _db.Payments
            .Where(p => p.BookingId == bookingId)
            .ToListAsync();

    public async Task AddAsync(Payment payment) =>
        await _db.Payments.AddAsync(payment);

    public Task UpdateAsync(Payment payment)
    {
        _db.Payments.Update(payment);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() =>
        await _db.SaveChangesAsync();
}