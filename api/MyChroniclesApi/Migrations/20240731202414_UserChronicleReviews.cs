using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    /// <inheritdoc />
    public partial class UserChronicleReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "rating",
                table: "Chronicles",
                type: "real",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "episodes",
                table: "Chronicles",
                type: "real",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "detailed_summary",
                table: "Chronicles",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ChroniclesReview",
                columns: table => new
                {
                    chronicle_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    review = table.Column<string>(type: "text", nullable: false),
                    usersId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChroniclesReview", x => new { x.chronicle_id, x.user_id });
                    table.ForeignKey(
                        name: "FK_ChroniclesReview_AspNetUsers_usersId",
                        column: x => x.usersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ChroniclesReview_Chronicles_chronicle_id",
                        column: x => x.chronicle_id,
                        principalTable: "Chronicles",
                        principalColumn: "chronicle_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChroniclesReview_usersId",
                table: "ChroniclesReview",
                column: "usersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChroniclesReview");

            migrationBuilder.DropColumn(
                name: "detailed_summary",
                table: "Chronicles");

            migrationBuilder.AlterColumn<int>(
                name: "rating",
                table: "Chronicles",
                type: "integer",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "real",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "episodes",
                table: "Chronicles",
                type: "integer",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "real",
                oldNullable: true);
        }
    }
}
