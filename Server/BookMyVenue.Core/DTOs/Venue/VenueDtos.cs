using BookMyVenue.Core.Enums;

namespace BookMyVenue.Core.DTOs.Venue;

public class CreateVenueDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public decimal PricePerDay { get; set; }
    public int Capacity { get; set; }
    public DateOnly AvailableFrom { get; set; }
    public DateOnly AvailableTo { get; set; }
    public List<string> Amenities { get; set; } = new();
    public List<string> Images { get; set; } = new();

    // Payment policy (optional)
    public bool IsAdvanceRequired { get; set; } = false;
    public decimal? AdvancePercentage { get; set; }
    public int? BalanceDueDaysBeforeEvent { get; set; }
    
    // Cancellation policy (optional)
    public bool IsCancellationAllowed { get; set; } = false;
    public int? CancellationDeadlineDays { get; set; }
}

public class UpdateVenueDto : CreateVenueDto { }

public class VenueSearchDto
{
    public string? City { get; set; }
    public string? Type { get; set; }
    public int? Capacity { get; set; }
    public decimal? MaxPrice { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}

public class BlockDatesDto
{
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public BlockedReason BlockedReason { get; set; } = BlockedReason.Other;
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
}

public class VenueResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public decimal PricePerDay { get; set; }
    public int Capacity { get; set; }
    public DateOnly AvailableFrom { get; set; }
    public DateOnly AvailableTo { get; set; }
    public List<BookedDateRangeDto> BookedDates { get; set; } = new();
    public List<BlockedDateRangeDto> BlockedDates { get; set; } = new();
    public string Status { get; set; } = string.Empty;
    public List<string> Amenities { get; set; } = new();
    public List<string> Images { get; set; } = new();
    public bool IsAdvanceRequired { get; set; }
    public decimal? AdvancePercentage { get; set; }
    public int? BalanceDueDaysBeforeEvent { get; set; }
    public bool IsCancellationAllowed { get; set; }
    public int? CancellationDeadlineDays { get; set; }
}

public class BookedDateRangeDto
{
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}

public class BlockedDateRangeDto
{
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string BlockedReason { get; set; } = string.Empty;
}