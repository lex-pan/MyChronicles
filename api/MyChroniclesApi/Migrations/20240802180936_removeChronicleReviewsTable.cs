using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    /// <inheritdoc />
    public partial class removeChronicleReviewsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChroniclesReview");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChroniclesReview",
                columns: table => new
                {
                    chronicle_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    usersId = table.Column<string>(type: "text", nullable: true),
                    review = table.Column<string>(type: "text", nullable: false)
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
    }
}
