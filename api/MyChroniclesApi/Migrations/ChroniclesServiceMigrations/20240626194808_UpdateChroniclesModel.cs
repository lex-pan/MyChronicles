using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations.ChroniclesServiceMigrations
{
    /// <inheritdoc />
    public partial class UpdateChroniclesModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "id",
                table: "chronicles",
                newName: "chronicle_id");

            migrationBuilder.AlterColumn<DateTime>(
                name: "db_add_date",
                table: "chronicles",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<DateTime>(
                name: "end_date",
                table: "chronicles",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "members",
                table: "chronicles",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "rating",
                table: "chronicles",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "start_date",
                table: "chronicles",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "chronicles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "synopsis",
                table: "chronicles",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "end_date",
                table: "chronicles");

            migrationBuilder.DropColumn(
                name: "members",
                table: "chronicles");

            migrationBuilder.DropColumn(
                name: "rating",
                table: "chronicles");

            migrationBuilder.DropColumn(
                name: "start_date",
                table: "chronicles");

            migrationBuilder.DropColumn(
                name: "status",
                table: "chronicles");

            migrationBuilder.DropColumn(
                name: "synopsis",
                table: "chronicles");

            migrationBuilder.RenameColumn(
                name: "chronicle_id",
                table: "chronicles",
                newName: "id");

            migrationBuilder.AlterColumn<DateTime>(
                name: "db_add_date",
                table: "chronicles",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);
        }
    }
}
