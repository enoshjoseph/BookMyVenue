using BookMyVenue.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookMyVenue.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<VenueOwnerProfile> VenueOwnerProfiles => Set<VenueOwnerProfile>();
    public DbSet<Venue> Venues => Set<Venue>();
    public DbSet<VenueImage> VenueImages => Set<VenueImage>();
    public DbSet<VenueAmenity> VenueAmenities => Set<VenueAmenity>();
    public DbSet<VenueBlockedDate> VenueBlockedDates => Set<VenueBlockedDate>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Refund> Refunds => Set<Refund>();

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // User
    modelBuilder.Entity<User>(e =>
    {
        e.HasIndex(u => u.Email).IsUnique();
        e.Property(u => u.Role).HasConversion<string>();
    });

    // VenueOwnerProfile → User (1-to-1)
    modelBuilder.Entity<VenueOwnerProfile>(e =>
    {
        e.HasOne(p => p.User)
         .WithOne(u => u.OwnerProfile)
         .HasForeignKey<VenueOwnerProfile>(p => p.UserId)
         .OnDelete(DeleteBehavior.Cascade);
    });

    // Venue → VenueOwnerProfile (many-to-1)
    modelBuilder.Entity<Venue>(e =>
    {
        e.Property(v => v.Status).HasConversion<string>();
        e.Property(v => v.PricePerDay).HasColumnType("numeric(18,2)");
        e.Property(v => v.AdvancePercentage).HasColumnType("numeric(5,2)");
        e.HasOne(v => v.Owner)
         .WithMany(o => o.Venues)
         .HasForeignKey(v => v.OwnerId)
         .OnDelete(DeleteBehavior.Cascade);
    });

    // VenueBlockedDate → Venue
    modelBuilder.Entity<VenueBlockedDate>(e =>
    {
        e.Property(b => b.BlockedReason).HasConversion<string>();
        e.HasOne(b => b.Venue)
         .WithMany(v => v.BlockedDates)
         .HasForeignKey(b => b.VenueId)
         .OnDelete(DeleteBehavior.Cascade);
    });

    // Booking
    modelBuilder.Entity<Booking>(e =>
    {
        e.Property(b => b.Status).HasConversion<string>();
        e.Property(b => b.PaymentStatus).HasConversion<string>();
        e.Property(b => b.TotalAmount).HasColumnType("numeric(18,2)");
        e.Property(b => b.AdvanceAmount).HasColumnType("numeric(18,2)");
        e.Property(b => b.BalanceAmount).HasColumnType("numeric(18,2)");
        e.HasOne(b => b.User)
         .WithMany(u => u.Bookings)
         .HasForeignKey(b => b.UserId)
         .OnDelete(DeleteBehavior.Restrict);
        e.HasOne(b => b.Venue)
         .WithMany(v => v.Bookings)
         .HasForeignKey(b => b.VenueId)
         .OnDelete(DeleteBehavior.Restrict);
    });

    // Payment → Booking
    modelBuilder.Entity<Payment>(e =>
    {
        e.Property(p => p.PaymentType).HasConversion<string>();
        e.Property(p => p.Status).HasConversion<string>();
        e.Property(p => p.Amount).HasColumnType("numeric(18,2)");
        e.HasOne(p => p.Booking)
         .WithMany(b => b.Payments)
         .HasForeignKey(p => p.BookingId)
         .OnDelete(DeleteBehavior.Cascade);
    });


    // Refund → Payment (1-to-1)
    modelBuilder.Entity<Refund>(e =>
    {
        e.Property(r => r.Status).HasConversion<string>();
        e.Property(r => r.Amount).HasColumnType("numeric(18,2)");
        e.HasOne(r => r.Payment)
         .WithOne(p => p.Refund)
         .HasForeignKey<Refund>(r => r.PaymentId)
         .OnDelete(DeleteBehavior.Cascade);
    });
}
}
