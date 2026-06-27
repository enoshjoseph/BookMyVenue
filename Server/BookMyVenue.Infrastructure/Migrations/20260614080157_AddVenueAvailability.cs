using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookMyVenue.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVenueAvailability : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "AvailableFrom",
                table: "Venues",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<DateOnly>(
                name: "AvailableTo",
                table: "Venues",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableFrom",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "AvailableTo",
                table: "Venues");
        }
    }
}
