using BookMyVenue.Core.DTOs.Venue;
using BookMyVenue.Core.Entities;
using BookMyVenue.Core.Enums;
using BookMyVenue.Core.Interfaces.Repositories;
using BookMyVenue.Core.Interfaces.Services;

namespace BookMyVenue.Infrastructure.Services;

public class VenueService : IVenueService
{
    private readonly IVenueRepository _venueRepo;

    public VenueService(IVenueRepository venueRepo)
    {
        _venueRepo = venueRepo;
    }

    public async Task<VenueResponseDto> CreateVenueAsync(Guid ownerId, CreateVenueDto dto)
    {
        if (dto.AvailableFrom < DateOnly.FromDateTime(DateTime.UtcNow))
        throw new Exception("Availability start date cannot be in the past.");

        if (dto.AvailableTo <= dto.AvailableFrom)
        throw new Exception("Availability end date must be after start date.");
        var venue = new Venue
        {
            OwnerId = ownerId,
            Name = dto.Name,
            Description = dto.Description,
            Type = dto.Type,
            Address = dto.Address,
            City = dto.City,
            PricePerDay = dto.PricePerDay,
            Capacity = dto.Capacity,
            Status = VenueStatus.Pending,
            AvailableFrom = dto.AvailableFrom,  // ← add this
            AvailableTo = dto.AvailableTo,      // ← add this
            IsAdvanceRequired = dto.IsAdvanceRequired,
            AdvancePercentage = dto.AdvancePercentage,
            BalanceDueDaysBeforeEvent = dto.BalanceDueDaysBeforeEvent,
            IsCancellationAllowed = dto.IsCancellationAllowed,
            CancellationDeadlineDays = dto.CancellationDeadlineDays,
            Amenities = dto.Amenities.Select(a => new VenueAmenity { Name = a }).ToList(),
            Images = dto.Images.Select((url, index) => new VenueImage { ImageUrl = url, IsPrimary = index == 0 }).ToList()
        };
        await _venueRepo.AddAsync(venue);
        await _venueRepo.SaveChangesAsync();
        

        return MapToDto(venue);
    }

    public async Task<VenueResponseDto> UpdateVenueAsync(Guid venueId, Guid ownerId, UpdateVenueDto dto)
    {
        var venue = await _venueRepo.GetByIdAsync(venueId)
            ?? throw new Exception("Venue not found.");

        if (venue.OwnerId != ownerId)
            throw new Exception("Unauthorized.");

        if (dto.AvailableFrom < DateOnly.FromDateTime(DateTime.UtcNow))
        throw new Exception("Availability start date cannot be in the past.");

         if (dto.AvailableTo <= dto.AvailableFrom)
            throw new Exception("Availability end date must be after start date.");

        bool invalidBookingExists = venue.Bookings.Any(b =>
            b.Status != BookingStatus.Cancelled &&
            (
                b.StartDate < dto.AvailableFrom ||
                b.EndDate > dto.AvailableTo
            ));

        if (invalidBookingExists)
            throw new Exception(
                "Cannot reduce availability because bookings exist outside the new range.");

        venue.Name = dto.Name;
        venue.Description = dto.Description;
        venue.Type = dto.Type;
        venue.Address = dto.Address;
        venue.City = dto.City;
        venue.PricePerDay = dto.PricePerDay;
        venue.Capacity = dto.Capacity;
        venue.AvailableFrom = dto.AvailableFrom;
        venue.AvailableTo = dto.AvailableTo;
        venue.IsAdvanceRequired = dto.IsAdvanceRequired;
        venue.AdvancePercentage = dto.AdvancePercentage;
        venue.BalanceDueDaysBeforeEvent = dto.BalanceDueDaysBeforeEvent;
        venue.IsCancellationAllowed = dto.IsCancellationAllowed;
        venue.CancellationDeadlineDays = dto.CancellationDeadlineDays;

        venue.Amenities.Clear();
        foreach (var a in dto.Amenities)
        {
            venue.Amenities.Add(new VenueAmenity { Name = a });
        }

        // await _venueRepo.ReplaceImagesAsync(venue, dto.Images);

        await _venueRepo.UpdateAsync(venue);
        await _venueRepo.SaveChangesAsync();

        return MapToDto(venue);
    }

    public async Task<VenueResponseDto?> GetVenueByIdAsync(Guid venueId)
    {
        var venue = await _venueRepo.GetByIdAsync(venueId);
        return venue == null ? null : MapToDto(venue);
    }

    public async Task<IEnumerable<VenueResponseDto>> SearchVenuesAsync(VenueSearchDto dto)
    {
        var venues = await _venueRepo.SearchAsync(dto.City, dto.Type, dto.Capacity, dto.MaxPrice);
        return venues.Select(MapToDto);
    }

    public async Task<IEnumerable<VenueResponseDto>> GetOwnerVenuesAsync(Guid ownerId)
    {
        var venues = await _venueRepo.GetByOwnerIdAsync(ownerId);
        return venues.Select(MapToDto);
    }

    public async Task<IEnumerable<VenueResponseDto>> GetAllVenuesAdminAsync()
    {
        var venues = await _venueRepo.GetAllAsync();
        return venues.Select(MapToDto);
    }

    public async Task ApproveVenueAsync(Guid venueId)
    {
        var venue = await _venueRepo.GetByIdAsync(venueId)
            ?? throw new Exception("Venue not found.");

        venue.Status = VenueStatus.Approved;
        await _venueRepo.UpdateAsync(venue);
        await _venueRepo.SaveChangesAsync();
    }

    public async Task RejectVenueAsync(Guid venueId)
    {
        var venue = await _venueRepo.GetByIdAsync(venueId)
            ?? throw new Exception("Venue not found.");

        venue.Status = VenueStatus.Rejected;
        await _venueRepo.UpdateAsync(venue);
        await _venueRepo.SaveChangesAsync();
    }

    public async Task BlockDatesAsync(Guid venueId, Guid ownerId, BlockDatesDto dto)
    {
        var venue = await _venueRepo.GetByIdAsync(venueId)
            ?? throw new Exception("Venue not found.");

        if (venue.OwnerId != ownerId)
            throw new Exception("Unauthorized.");

        venue.BlockedDates.Add(new VenueBlockedDate
        {
            VenueId = venueId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            BlockedReason = dto.BlockedReason,
            CustomerName = dto.CustomerName,
            CustomerPhone = dto.CustomerPhone
        });

        await _venueRepo.UpdateAsync(venue);
        await _venueRepo.SaveChangesAsync();
    }

    private static VenueResponseDto MapToDto(Venue v) => new()
    {
        Id = v.Id,
        Name = v.Name,
        Description = v.Description,
        Type = v.Type,
        Address = v.Address,
        City = v.City,
        PricePerDay = v.PricePerDay,
        Capacity = v.Capacity,

        AvailableFrom = v.AvailableFrom,
        AvailableTo = v.AvailableTo,

        Status = v.Status.ToString(),

        Amenities = v.Amenities.Select(a => a.Name).ToList(),
        Images = v.Images.Select(i => i.ImageUrl).ToList(),
         BookedDates = v.Bookings
        .Where(b => b.Status != BookingStatus.Cancelled)
        .Select(b => new BookedDateRangeDto
        {
            StartDate = b.StartDate,
            EndDate = b.EndDate
        })
        .ToList(),

        BlockedDates = v.BlockedDates
        .Select(b => new BlockedDateRangeDto
        {
            StartDate = b.StartDate,
            EndDate = b.EndDate,
            BlockedReason = b.BlockedReason.ToString()
        })
        .ToList(),

        IsAdvanceRequired = v.IsAdvanceRequired,
        AdvancePercentage = v.AdvancePercentage,
        BalanceDueDaysBeforeEvent = v.BalanceDueDaysBeforeEvent,
        IsCancellationAllowed = v.IsCancellationAllowed,
        CancellationDeadlineDays = v.CancellationDeadlineDays
    };
}