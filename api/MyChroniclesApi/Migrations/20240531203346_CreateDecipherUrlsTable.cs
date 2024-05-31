using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    /// <inheritdoc />
    public partial class CreateDecipherUrlsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "chronicle_extension_decipher",
                columns: table => new
                {
                    domain = table.Column<string>(type: "text", nullable: false),
                    decipher_method = table.Column<string>(type: "text", nullable: true),
                    date_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chronicle_extension_decipher", x => x.domain);
                });

            migrationBuilder.CreateTable(
                name: "decipher_steps",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    domain = table.Column<string>(type: "text", nullable: false),
                    chronicle_info_category = table.Column<string>(type: "text", nullable: false),
                    step_number = table.Column<int>(type: "integer", nullable: false),
                    word_start = table.Column<string>(type: "text", nullable: false),
                    word_start_index = table.Column<int>(type: "integer", nullable: false),
                    word_start_adjustment = table.Column<int>(type: "integer", nullable: false),
                    word_end = table.Column<string>(type: "text", nullable: false),
                    word_end_index = table.Column<int>(type: "integer", nullable: false),
                    word_end_adjustment = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_decipher_steps", x => x.id);
                    table.ForeignKey(
                        name: "FK_decipher_steps_chronicle_extension_decipher_domain",
                        column: x => x.domain,
                        principalTable: "chronicle_extension_decipher",
                        principalColumn: "domain",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_decipher_steps_domain",
                table: "decipher_steps",
                column: "domain");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "decipher_steps");

            migrationBuilder.DropTable(
                name: "chronicle_extension_decipher");
        }
    }
}
