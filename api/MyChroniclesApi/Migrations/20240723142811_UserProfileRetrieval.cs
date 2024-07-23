using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    /// <inheritdoc />
    public partial class UserProfileRetrieval : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "date_read",
                table: "UserHistory",
                newName: "date_of_action");

            migrationBuilder.RenameColumn(
                name: "last_login",
                table: "AspNetUsers",
                newName: "last_online");

            migrationBuilder.AddColumn<string>(
                name: "action",
                table: "UserHistory",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<float>(
                name: "avg_rating",
                table: "AspNetUsers",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "num_watched_read",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "action",
                table: "UserHistory");

            migrationBuilder.DropColumn(
                name: "avg_rating",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "num_watched_read",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "date_of_action",
                table: "UserHistory",
                newName: "date_read");

            migrationBuilder.RenameColumn(
                name: "last_online",
                table: "AspNetUsers",
                newName: "last_login");
        }
    }
}
