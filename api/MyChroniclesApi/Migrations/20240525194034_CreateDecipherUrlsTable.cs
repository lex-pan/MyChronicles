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
                name: "DOMIdentifier",
                columns: table => new
                {
                    id = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    tag = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    index = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DOMIdentifier", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "chronicle_extension_decipher",
                columns: table => new
                {
                    Domain = table.Column<string>(type: "text", nullable: false),
                    Selection_type = table.Column<string>(type: "text", nullable: true),
                    dom_selectorid = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    date_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chronicle_extension_decipher", x => x.Domain);
                    table.ForeignKey(
                        name: "FK_chronicle_extension_decipher_DOMIdentifier_dom_selectorid",
                        column: x => x.dom_selectorid,
                        principalTable: "DOMIdentifier",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "DecipherSteps",
                columns: table => new
                {
                    id = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    word_to_find = table.Column<string>(type: "text", nullable: false),
                    word_start = table.Column<string>(type: "text", nullable: false),
                    word_end = table.Column<string>(type: "text", nullable: false),
                    DecipherUrlsDomain = table.Column<string>(type: "text", nullable: true),
                    DecipherUrlsDomain1 = table.Column<string>(type: "text", nullable: true),
                    DecipherUrlsDomain2 = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DecipherSteps", x => x.id);
                    table.ForeignKey(
                        name: "FK_DecipherSteps_chronicle_extension_decipher_DecipherUrlsDoma~",
                        column: x => x.DecipherUrlsDomain,
                        principalTable: "chronicle_extension_decipher",
                        principalColumn: "Domain");
                    table.ForeignKey(
                        name: "FK_DecipherSteps_chronicle_extension_decipher_DecipherUrlsDom~1",
                        column: x => x.DecipherUrlsDomain1,
                        principalTable: "chronicle_extension_decipher",
                        principalColumn: "Domain");
                    table.ForeignKey(
                        name: "FK_DecipherSteps_chronicle_extension_decipher_DecipherUrlsDom~2",
                        column: x => x.DecipherUrlsDomain2,
                        principalTable: "chronicle_extension_decipher",
                        principalColumn: "Domain");
                });

            migrationBuilder.CreateIndex(
                name: "IX_chronicle_extension_decipher_dom_selectorid",
                table: "chronicle_extension_decipher",
                column: "dom_selectorid");

            migrationBuilder.CreateIndex(
                name: "IX_DecipherSteps_DecipherUrlsDomain",
                table: "DecipherSteps",
                column: "DecipherUrlsDomain");

            migrationBuilder.CreateIndex(
                name: "IX_DecipherSteps_DecipherUrlsDomain1",
                table: "DecipherSteps",
                column: "DecipherUrlsDomain1");

            migrationBuilder.CreateIndex(
                name: "IX_DecipherSteps_DecipherUrlsDomain2",
                table: "DecipherSteps",
                column: "DecipherUrlsDomain2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DecipherSteps");

            migrationBuilder.DropTable(
                name: "chronicle_extension_decipher");

            migrationBuilder.DropTable(
                name: "DOMIdentifier");
        }
    }
}
