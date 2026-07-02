using System.Security.Claims;
using BookMyVenue.Core.DTOs.Booking;
using BookMyVenue.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookMyVenue.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private Guid OwnerId => Guid.Parse(User.FindFirstValue("ownerId")!);

    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
    {
        try
        {
            var result = await _bookingService.CreateBookingAsync(UserId, dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("my")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> GetMyBookings()
    {
        var bookings = await _bookingService.GetUserBookingsAsync(UserId);
        return Ok(bookings);
    }

    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllBookingsForAdmin()
    {
        var bookings = await _bookingService.GetAllBookingsAdminAsync();
        return Ok(bookings);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBooking(Guid id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);
        return booking == null ? NotFound() : Ok(booking);
    }

    [HttpGet("venue/{venueId}")]
    [Authorize(Roles = "VenueOwner")]
    public async Task<IActionResult> GetVenueBookings(Guid venueId)
    {
        try
        {
            var bookings = await _bookingService.GetVenueBookingsAsync(venueId, OwnerId);
            return Ok(bookings);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/confirm")]
    [Authorize(Roles = "VenueOwner")]
    public async Task<IActionResult> ConfirmBooking(Guid id)
    {
        try
        {
            await _bookingService.ConfirmBookingAsync(id, OwnerId);
            return Ok(new { message = "Booking confirmed." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/decline")]
    [Authorize(Roles = "VenueOwner")]
    public async Task<IActionResult> DeclineBooking(Guid id)
    {
        try
        {
            await _bookingService.DeclineBookingAsync(id, OwnerId);
            return Ok(new { message = "Booking declined." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/cancel")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> CancelBooking(Guid id)
    {
        try
        {
            await _bookingService.CancelBookingAsync(id, UserId);
            return Ok(new { message = "Booking cancelled." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}