namespace BookMyVenue.Core.Interfaces.Services;

public interface IRedisLockService
{
    Task<bool> AcquireBookingLockAsync(
    Guid venueId,
    Guid userId,
    DateOnly startDate,
    DateOnly endDate,
    TimeSpan expiry);

    Task ReleaseBookingLockAsync(
    Guid venueId,
    Guid userId,
    DateOnly startDate,
    DateOnly endDate);

    Task ExtendBookingLockAsync(
    Guid venueId,
    DateOnly startDate,
    DateOnly endDate,
    TimeSpan expiry);
}