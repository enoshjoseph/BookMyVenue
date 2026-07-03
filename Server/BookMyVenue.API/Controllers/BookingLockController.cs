using System.Security.Claims;
using BookMyVenue.Core.DTOs.Booking;
using BookMyVenue.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookMyVenue.API.Controllers;

[ApiController]
[Route("api/booking-lock")]
[Authorize]
public class BookingLockController : ControllerBase
{
    private readonly IRedisLockService _redisLockService;

    public BookingLockController(IRedisLockService redisLockService)
    {
        _redisLockService = redisLockService;
    }

    private Guid UserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("acquire")]
public async Task<IActionResult> AcquireLock(BookingLockRequestDto dto)
{
    var acquired = await _redisLockService.AcquireBookingLockAsync(
        dto.VenueId,
        UserId,
        dto.StartDate,
        dto.EndDate,
        TimeSpan.FromMinutes(10));

    if (!acquired)
    {
        return Conflict(new
        {
            success = false,
            message = "One or more selected dates are already being booked by another user."
        });
    }

    return Ok(new
    {
        success = true,
        message = "Booking lock acquired."
    });
}
}