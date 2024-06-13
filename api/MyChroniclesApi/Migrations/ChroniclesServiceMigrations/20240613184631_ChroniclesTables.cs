using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations.ChroniclesServiceMigrations
{
    /// <inheritdoc />
    public partial class ChroniclesTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "character",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    age = table.Column<int>(type: "integer", nullable: true),
                    gender = table.Column<string>(type: "text", nullable: true),
                    background = table.Column<string>(type: "text", nullable: true),
                    appearance = table.Column<string>(type: "text", nullable: true),
                    personality = table.Column<string>(type: "text", nullable: true),
                    abilities = table.Column<string>(type: "text", nullable: true),
                    social_connections = table.Column<string>(type: "text", nullable: true),
                    about = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_character", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "chronicles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    author = table.Column<string>(type: "text", nullable: true),
                    entertainment_category = table.Column<string>(type: "text", nullable: true),
                    episodes = table.Column<int>(type: "integer", nullable: true),
                    length = table.Column<int>(type: "integer", nullable: true),
                    creation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    language = table.Column<string>(type: "text", nullable: true),
                    country = table.Column<string>(type: "text", nullable: true),
                    db_add_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chronicles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "alternative_titles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    alternative_title = table.Column<string>(type: "text", nullable: false),
                    chronicle_id = table.Column<Guid>(type: "uuid", nullable: false),
                    source = table.Column<string>(type: "text", nullable: true),
                    year = table.Column<int>(type: "integer", nullable: true),
                    producer = table.Column<string>(type: "text", nullable: true),
                    entertainment_category = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alternative_titles", x => x.id);
                    table.ForeignKey(
                        name: "FK_alternative_titles_chronicles_chronicle_id",
                        column: x => x.chronicle_id,
                        principalTable: "chronicles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "chronicles_cast",
                columns: table => new
                {
                    character_id = table.Column<Guid>(type: "uuid", nullable: false),
                    chronicle_id = table.Column<Guid>(type: "uuid", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chronicles_cast", x => new { x.chronicle_id, x.character_id });
                    table.ForeignKey(
                        name: "FK_chronicles_cast_character_character_id",
                        column: x => x.character_id,
                        principalTable: "character",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_chronicles_cast_chronicles_chronicle_id",
                        column: x => x.chronicle_id,
                        principalTable: "chronicles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "chronicles_genre",
                columns: table => new
                {
                    chronicle_id = table.Column<Guid>(type: "uuid", nullable: false),
                    genre = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chronicles_genre", x => new { x.chronicle_id, x.genre });
                    table.ForeignKey(
                        name: "FK_chronicles_genre_chronicles_chronicle_id",
                        column: x => x.chronicle_id,
                        principalTable: "chronicles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "chronicles_tag",
                columns: table => new
                {
                    chronicle_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tag = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chronicles_tag", x => new { x.chronicle_id, x.tag });
                    table.ForeignKey(
                        name: "FK_chronicles_tag_chronicles_chronicle_id",
                        column: x => x.chronicle_id,
                        principalTable: "chronicles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_alternative_titles_chronicle_id",
                table: "alternative_titles",
                column: "chronicle_id");

            migrationBuilder.CreateIndex(
                name: "IX_chronicles_cast_character_id",
                table: "chronicles_cast",
                column: "character_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "alternative_titles");

            migrationBuilder.DropTable(
                name: "chronicles_cast");

            migrationBuilder.DropTable(
                name: "chronicles_genre");

            migrationBuilder.DropTable(
                name: "chronicles_tag");

            migrationBuilder.DropTable(
                name: "character");

            migrationBuilder.DropTable(
                name: "chronicles");
        }
    }
}
