namespace BookMyVenue.Core.DTOs.Payment;

public class PaymentOrderDto
{
    public string RazorpayOrderId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public string PaymentType { get; set; } = string.Empty;
}

public class PaymentVerifyDto
{
    public Guid BookingId { get; set; }
    public string RazorpayOrderId { get; set; } = string.Empty;
    public string RazorpayPaymentId { get; set; } = string.Empty;
    public string RazorpaySignature { get; set; } = string.Empty;
    public string PaymentType { get; set; } = string.Empty;
}