using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    /// <inheritdoc />
    public partial class removeGenreTagTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChroniclesGenres");

            migrationBuilder.DropTable(
                name: "ChroniclesTags");

            migrationBuilder.AddColumn<string[]>(
                name: "genres",
                table: "Chronicles",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "tags",
                table: "Chronicles",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "alt_titles",
                table: "ChronicleChanges",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string[]>(
                name: "genres",
                table: "ChronicleChanges",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string[]>(
                name: "other_creators",
                table: "ChronicleChanges",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string[]>(
                name: "tags",
                table: "ChronicleChanges",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "genres",
                table: "Chronicles");

            migrationBuilder.DropColumn(
                name: "tags",
                table: "Chronicles");

            migrationBuilder.DropColumn(
                name: "alt_titles",
                table: "ChronicleChanges");

            migrationBuilder.DropColumn(
                name: "genres",
                table: "ChronicleChanges");

            migrationBuilder.DropColumn(
                name: "other_creators",
                table: "ChronicleChanges");

            migrationBuilder.DropColumn(
                name: "tags",
                table: "ChronicleChanges");

            migrationBuilder.CreateTable(
                name: "ChroniclesGenres",
                columns: table => new
                {
                    chronicle_id = table.Column<Guid>(type: "uuid", nullable: false),
                    genre = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChroniclesGenres", x => new { x.chronicle_id, x.genre });
                    table.ForeignKey(
                        name: "FK_ChroniclesGenres_Chronicles_chronicle_id",
                        column: x => x.chronicle_id,
                        principalTable: "Chronicles",
                        principalColumn: "chronicle_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChroniclesTags",
                columns: table => new
                {
                    chronicle_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tag = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChroniclesTags", x => new { x.chronicle_id, x.tag });
                    table.ForeignKey(
                        name: "FK_ChroniclesTags_Chronicles_chronicle_id",
                        column: x => x.chronicle_id,
                        principalTable: "Chronicles",
                        principalColumn: "chronicle_id",
                        onDelete: ReferentialAction.Cascade);
                });
        }
    }
}
