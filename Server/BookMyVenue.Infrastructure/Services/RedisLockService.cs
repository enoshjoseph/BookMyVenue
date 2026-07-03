using BookMyVenue.Core.Interfaces.Services;
using StackExchange.Redis;

namespace BookMyVenue.Infrastructure.Services;

public class RedisLockService : IRedisLockService
{
    private readonly IDatabase _database;

    public RedisLockService(IConnectionMultiplexer redis)
    {
        _database = redis.GetDatabase();
    }

    // Helper 1: Generates a Redis key for a venue on a specific date
    private static string GetLockKey(Guid venueId, DateOnly date)
    {
        return $"lock:{venueId}:{date:yyyy-MM-dd}";
    }

    // Helper 2: Generates every date between start and end
    private static IEnumerable<DateOnly> GetDates(DateOnly start, DateOnly end)
    {
        for (var date = start; date <= end; date = date.AddDays(1))
        {
            yield return date;
        }
    }

    // We'll implement this next
    public async Task<bool> AcquireBookingLockAsync(
    Guid venueId,
    Guid userId,
    DateOnly startDate,
    DateOnly endDate,
    TimeSpan expiry)
    {
        var acquiredKeys = new List<string>();

        foreach (var date in GetDates(startDate, endDate))
        {
            var key = GetLockKey(venueId, date);

            var locked = await _database.StringSetAsync(
                key,
                userId.ToString(),
                expiry,
                When.NotExists);

            if (locked)
            {
                acquiredKeys.Add(key);
                continue;
            }

            // Rollback
            foreach (var acquiredKey in acquiredKeys)
            {
                var value = await _database.StringGetAsync(acquiredKey);

                if (value == userId.ToString())
                {
                    await _database.KeyDeleteAsync(acquiredKey);
                }
            }

            return false;
        }

        return true;
    }

    // We'll implement this later
    public async Task ReleaseBookingLockAsync(
        Guid venueId,
        Guid userId,
        DateOnly startDate,
        DateOnly endDate)
    {
        throw new NotImplementedException();
    }

    // We'll implement this later
    public async Task ExtendBookingLockAsync(
        Guid venueId,
        DateOnly startDate,
        DateOnly endDate,
        TimeSpan expiry)
    {
        throw new NotImplementedException();
    }
}