using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    /// <inheritdoc />
    public partial class review_date : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "review_date",
                table: "UserChronicles",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "review_date",
                table: "UserChronicles");
        }
    }
}
