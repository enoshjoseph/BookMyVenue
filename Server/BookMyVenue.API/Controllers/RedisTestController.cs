using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace BookMyVenue.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RedisTestController : ControllerBase
{
    private readonly IConnectionMultiplexer _redis;

    public RedisTestController(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    [HttpGet]
    public async Task<IActionResult> Test()
    {
        var db = _redis.GetDatabase();

        await db.StringSetAsync("test", "BookMyVenue");

        var value = await db.StringGetAsync("test");

        return Ok(new
        {
            message = value.ToString()
        });
    }
}