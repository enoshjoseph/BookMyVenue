using BookMyVenue.Core.DTOs.Auth;
using BookMyVenue.Core.DTOs.Venue;
using BookMyVenue.Core.DTOs.Booking;
using BookMyVenue.Core.DTOs.Payment;
namespace BookMyVenue.Core.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}

public interface IVenueService
{
    Task<VenueResponseDto> CreateVenueAsync(Guid ownerId, CreateVenueDto dto);
    Task<VenueResponseDto> UpdateVenueAsync(Guid venueId, Guid ownerId, UpdateVenueDto dto);
    Task<VenueResponseDto?> GetVenueByIdAsync(Guid venueId);
    Task<IEnumerable<VenueResponseDto>> SearchVenuesAsync(VenueSearchDto dto);
    Task<IEnumerable<VenueResponseDto>> GetOwnerVenuesAsync(Guid ownerId);
    Task ApproveVenueAsync(Guid venueId);
    Task RejectVenueAsync(Guid venueId);
    Task BlockDatesAsync(Guid venueId, Guid ownerId, BlockDatesDto dto);
}

public interface IBookingService
{
    Task<BookingResponseDto> CreateBookingAsync(Guid userId, CreateBookingDto dto);
    Task<BookingResponseDto?> GetBookingByIdAsync(Guid bookingId);
    Task<IEnumerable<BookingResponseDto>> GetUserBookingsAsync(Guid userId);
    Task<IEnumerable<BookingResponseDto>> GetVenueBookingsAsync(Guid venueId, Guid ownerId);
    Task ConfirmBookingAsync(Guid bookingId, Guid ownerId);
    Task DeclineBookingAsync(Guid bookingId, Guid ownerId);
    Task CancelBookingAsync(Guid bookingId, Guid userId);
}

public interface IPaymentService
{
    Task<PaymentOrderDto> CreatePaymentOrderAsync(Guid bookingId, Guid userId);
    Task VerifyAndConfirmPaymentAsync(PaymentVerifyDto dto);
}   