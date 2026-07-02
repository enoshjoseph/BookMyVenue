using System.Text;
using BookMyVenue.Core.Interfaces.Repositories;
using BookMyVenue.Core.Interfaces.Services;
using BookMyVenue.Infrastructure.Data;
using BookMyVenue.Infrastructure.Repositories;
using BookMyVenue.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using BookMyVenue.Core.Entities;
using BookMyVenue.Core.Enums;

DotNetEnv.Env.Load();
Console.WriteLine("KeyId: " + Environment.GetEnvironmentVariable("RAZORPAY_KEY_ID"));
Console.WriteLine("KeySecret: " + Environment.GetEnvironmentVariable("RAZORPAY_KEY_SECRET"));

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();

// ── Database ──────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Repositories ──────────────────────────────────────────
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IVenueRepository, VenueRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();

// ── Services ──────────────────────────────────────────────
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IVenueService, VenueService>();

// ── JWT Auth ──────────────────────────────────────────────
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

// ── CORS ──────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ── Swagger ───────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "BookMyVenue API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    var adminExists = db.Users.Any(u => u.Role == UserRole.Admin);
    if (!adminExists)
    {
        db.Users.Add(new User
        {
            FullName = "Admin",
            Email = "admin@bookmyvenue.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = UserRole.Admin,
            IsActive = true
        });
        db.SaveChanges();
    }

    var venuesWithoutImages = db.Venues.Include(v => v.Images).Where(v => v.Images.Count == 0).ToList();
    foreach (var v in venuesWithoutImages)
    {
        string imgUrl = "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200";
        if (v.Name.Contains("Hyat", StringComparison.OrdinalIgnoreCase))
            imgUrl = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200";
        else if (v.Name.Contains("Marirot", StringComparison.OrdinalIgnoreCase) || v.Name.Contains("Marriot", StringComparison.OrdinalIgnoreCase))
            imgUrl = "https://images.unsplash.com/photo-1545232972-fbfe6ac591fa?auto=format&fit=crop&q=80&w=1200";
        else if (v.Name.Contains("Royal", StringComparison.OrdinalIgnoreCase))
            imgUrl = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200";

        var img = new VenueImage { Id = Guid.NewGuid(), VenueId = v.Id, ImageUrl = imgUrl, IsPrimary = true };
        db.Set<VenueImage>().Add(img);
    }
    if (venuesWithoutImages.Count > 0)
    {
        db.SaveChanges();
    }
}

// ── Middleware pipeline ────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var wwwRootPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot");
if (!Directory.Exists(wwwRootPath))
{
    Directory.CreateDirectory(wwwRootPath);
}
app.UseStaticFiles();

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();