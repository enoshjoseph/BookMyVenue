    namespace BookMyVenue.Core.Enums;

    public enum UserRole
    {
        User,
        VenueOwner,
        Admin
    }

    public enum VenueStatus
    {
        Pending,
        Approved,
        Rejected,
        Suspended
    }

    public enum BookingStatus
    {
        Pending,
        Confirmed,
        Cancelled,
        Completed
    }

    public enum PaymentStatus
    {
        Pending,
        PartiallyPaid,
        FullyPaid
    }

    public enum PaymentType
    {
        Advance,
        Balance,
        Full
    }

    public enum PaymentTransactionStatus
    {
        Pending,
        Paid,
        Failed

    }

    public enum RefundStatus
    {
        Requested,
        Approved,
        Processed,
        Rejected
    }

    public enum BlockedReason
{
    DirectBooking,
    Maintenance,
    Personal,
    Other
}