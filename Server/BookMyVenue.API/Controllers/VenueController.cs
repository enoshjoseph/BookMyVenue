using System.Security.Claims;
using BookMyVenue.Core.DTOs.Venue;
using BookMyVenue.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookMyVenue.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VenueController : ControllerBase
{
    private readonly IVenueService _venueService;

    public VenueController(IVenueService venueService)
    {
        _venueService = venueService;
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private Guid OwnerId => Guid.Parse(User.FindFirstValue("ownerId")!);

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] VenueSearchDto dto)
    {
        var venues = await _venueService.SearchVenuesAsync(dto);
        return Ok(venues);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetVenue(Guid id)
    {
        var venue = await _venueService.GetVenueByIdAsync(id);
        return venue == null ? NotFound() : Ok(venue);
    }

    [HttpPost]
    [Authorize(Roles = "VenueOwner")]
    public async Task<IActionResult> CreateVenue([FromBody] CreateVenueDto dto)
    {
        try
        {
            var result = await _venueService.CreateVenueAsync(OwnerId, dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "VenueOwner")]
    public async Task<IActionResult> UpdateVenue(Guid id, [FromBody] UpdateVenueDto dto)
    {
        try
        {
            var result = await _venueService.UpdateVenueAsync(id, OwnerId, dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("upload-images")]
    [Authorize(Roles = "VenueOwner,Admin")]
    public async Task<IActionResult> UploadImages(List<IFormFile> files)
    {
        try
        {
            if (files == null || files.Count == 0)
                return BadRequest(new { message = "No files uploaded." });

            var allowedTypes = new[]
        {
            "image/jpeg",
            "image/png",
            "image/webp"
        };

            var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadPath = Path.Combine(webRootPath, "uploads", "venues");
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            var imageUrls = new List<string>();
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            foreach (var file in files)
            {
                if (file.Length <= 0)
                    continue;

                // Validate image type
                if (!allowedTypes.Contains(file.ContentType))
                {
                    return BadRequest(new
                    {
                        message = $"Unsupported image type: {file.ContentType}. Only JPG, PNG and WebP are allowed."
                    });
                }

                var extension = Path.GetExtension(file.FileName);
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                imageUrls.Add($"{baseUrl}/uploads/venues/{fileName}");
            }

            return Ok(new { urls = imageUrls });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("my")]
    [Authorize(Roles = "VenueOwner")]
    public async Task<IActionResult> GetMyVenues()
    {
        var venues = await _venueService.GetOwnerVenuesAsync(OwnerId);
        return Ok(venues);
    }

    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllVenuesForAdmin()
    {
        var venues = await _venueService.GetAllVenuesAdminAsync();
        return Ok(venues);
    }

    [HttpPost("{id}/block-dates")]
    [Authorize(Roles = "VenueOwner")]
    public async Task<IActionResult> BlockDates(Guid id, [FromBody] BlockDatesDto dto)
    {
        try
        {
            await _venueService.BlockDatesAsync(id, OwnerId, dto);
            return Ok(new { message = "Dates blocked successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveVenue(Guid id)
    {
        try
        {
            await _venueService.ApproveVenueAsync(id);
            return Ok(new { message = "Venue approved." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RejectVenue(Guid id)
    {
        try
        {
            await _venueService.RejectVenueAsync(id);
            return Ok(new { message = "Venue rejected." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}