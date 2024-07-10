using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    /// <inheritdoc />
    public partial class float_episodes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "episode",
                table: "UserChronicles",
                type: "real",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "episode",
                table: "UserChronicles",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(float),
                oldType: "real",
                oldNullable: true);
        }
    }
}
