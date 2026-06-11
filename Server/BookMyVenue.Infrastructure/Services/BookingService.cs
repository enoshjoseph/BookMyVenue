using BookMyVenue.Core.DTOs.Booking;
using BookMyVenue.Core.Entities;
using BookMyVenue.Core.Enums;
using BookMyVenue.Core.Interfaces.Repositories;
using BookMyVenue.Core.Interfaces.Services;

namespace BookMyVenue.Infrastructure.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepo;
    private readonly IVenueRepository _venueRepo;

    public BookingService(IBookingRepository bookingRepo, IVenueRepository venueRepo)
    {
        _bookingRepo = bookingRepo;
        _venueRepo = venueRepo;
    }

    public async Task<BookingResponseDto> CreateBookingAsync(Guid userId, CreateBookingDto dto)
    {
        var venue = await _venueRepo.GetByIdAsync(dto.VenueId)
            ?? throw new Exception("Venue not found.");

        if (venue.Status != VenueStatus.Approved)
            throw new Exception("Venue is not available for booking.");

        var isAvailable = await _bookingRepo.IsVenueAvailableAsync(
            dto.VenueId, dto.StartDate, dto.EndDate);

        if (!isAvailable)
            throw new Exception("Venue is not available for the selected dates.");

        var days = dto.EndDate.DayNumber - dto.StartDate.DayNumber + 1;
        var totalAmount = venue.PricePerDay * days;

        decimal advanceAmount = 0;
        decimal balanceAmount = 0;
        DateOnly? balanceDueDate = null;

        if (venue.IsAdvanceRequired && venue.AdvancePercentage.HasValue)
        {
            advanceAmount = totalAmount * venue.AdvancePercentage.Value / 100;
            balanceAmount = totalAmount - advanceAmount;
            balanceDueDate = venue.BalanceDueDaysBeforeEvent.HasValue
                ? dto.StartDate.AddDays(-venue.BalanceDueDaysBeforeEvent.Value)
                : null;
        }
        else
        {
            advanceAmount = totalAmount;
        }

        var booking = new Booking
        {
            UserId = userId,
            VenueId = dto.VenueId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            TotalAmount = totalAmount,
            AdvanceAmount = advanceAmount,
            BalanceAmount = balanceAmount,
            BalanceDueDate = balanceDueDate,
            Status = BookingStatus.Pending,
            PaymentStatus = PaymentStatus.Pending
        };

        await _bookingRepo.AddAsync(booking);
        await _bookingRepo.SaveChangesAsync();

        return MapToDto(booking, venue.Name);
    }

    public async Task<BookingResponseDto?> GetBookingByIdAsync(Guid bookingId)
    {
        var booking = await _bookingRepo.GetByIdAsync(bookingId);
        return booking == null ? null : MapToDto(booking, booking.Venue.Name);
    }

    public async Task<IEnumerable<BookingResponseDto>> GetUserBookingsAsync(Guid userId)
    {
        var bookings = await _bookingRepo.GetByUserIdAsync(userId);
        return bookings.Select(b => MapToDto(b, b.Venue.Name));
    }

    public async Task<IEnumerable<BookingResponseDto>> GetVenueBookingsAsync(Guid venueId, Guid ownerId)
    {
        var venue = await _venueRepo.GetByIdAsync(venueId)
            ?? throw new Exception("Venue not found.");

        if (venue.OwnerId != ownerId)
            throw new Exception("Unauthorized.");

        var bookings = await _bookingRepo.GetByVenueIdAsync(venueId);
        return bookings.Select(b => MapToDto(b, venue.Name));
    }

    public async Task ConfirmBookingAsync(Guid bookingId, Guid ownerId)
    {
        var booking = await _bookingRepo.GetByIdAsync(bookingId)
            ?? throw new Exception("Booking not found.");

        if (booking.Venue.OwnerId != ownerId)
            throw new Exception("Unauthorized.");

        booking.Status = BookingStatus.Confirmed;
        await _bookingRepo.UpdateAsync(booking);
        await _bookingRepo.SaveChangesAsync();
    }

    public async Task DeclineBookingAsync(Guid bookingId, Guid ownerId)
    {
        var booking = await _bookingRepo.GetByIdAsync(bookingId)
            ?? throw new Exception("Booking not found.");

        if (booking.Venue.OwnerId != ownerId)
            throw new Exception("Unauthorized.");

        booking.Status = BookingStatus.Cancelled;
        await _bookingRepo.UpdateAsync(booking);
        await _bookingRepo.SaveChangesAsync();
    }

    public async Task CancelBookingAsync(Guid bookingId, Guid userId)
    {
        var booking = await _bookingRepo.GetByIdAsync(bookingId)
            ?? throw new Exception("Booking not found.");

        if (booking.UserId != userId)
            throw new Exception("Unauthorized.");

        if (!booking.Venue.IsCancellationAllowed)
            throw new Exception("This venue does not allow cancellations.");

        if (booking.Venue.CancellationDeadlineDays.HasValue)
        {
            var deadline = booking.StartDate.AddDays(-booking.Venue.CancellationDeadlineDays.Value);
            if (DateOnly.FromDateTime(DateTime.UtcNow) > deadline)
                throw new Exception("Cancellation deadline has passed. No refund will be issued.");
        }

        booking.Status = BookingStatus.Cancelled;
        await _bookingRepo.UpdateAsync(booking);
        await _bookingRepo.SaveChangesAsync();
    }

    private static BookingResponseDto MapToDto(Booking b, string venueName) => new()
    {
        Id = b.Id,
        VenueId = b.VenueId,
        VenueName = venueName,
        StartDate = b.StartDate,
        EndDate = b.EndDate,
        TotalAmount = b.TotalAmount,
        AdvanceAmount = b.AdvanceAmount,
        BalanceAmount = b.BalanceAmount,
        BalanceDueDate = b.BalanceDueDate,
        Status = b.Status.ToString(),
        PaymentStatus = b.PaymentStatus.ToString(),
        CreatedAt = b.CreatedAt
    };
}