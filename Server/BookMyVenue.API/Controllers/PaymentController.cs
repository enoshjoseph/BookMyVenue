using System.Security.Claims;
using BookMyVenue.Core.DTOs.Payment;
using BookMyVenue.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookMyVenue.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("order/{bookingId}")]
    public async Task<IActionResult> CreateOrder(Guid bookingId)
    {
        try
        {
            var order = await _paymentService.CreatePaymentOrderAsync(bookingId, UserId);
            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyPayment([FromBody] PaymentVerifyDto dto)
    {
        try
        {
            await _paymentService.VerifyAndConfirmPaymentAsync(dto);
            return Ok(new { message = "Payment verified and booking confirmed." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}