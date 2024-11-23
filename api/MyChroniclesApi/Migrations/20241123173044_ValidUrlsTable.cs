using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    /// <inheritdoc />
    public partial class ValidUrlsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop foreign key constraint that references the old Urls table
            migrationBuilder.DropForeignKey(
                name: "FK_DecipherUrlSteps_Urls_domain",
                table: "DecipherUrlSteps");

            // Rename the "Urls" table to "DomainDeciphers"
            migrationBuilder.RenameTable(
                name: "Urls",
                newName: "DomainDeciphers");

            // Create a new table for ValidUrls
            migrationBuilder.CreateTable(
                name: "ValidUrls",
                columns: table => new
                {
                    regex_url = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValidUrls", x => x.regex_url);
                });

            // Add the foreign key constraint for the renamed table
            migrationBuilder.AddForeignKey(
                name: "FK_DecipherUrlSteps_DomainDeciphers_domain",
                table: "DecipherUrlSteps",
                column: "domain",
                principalTable: "DomainDeciphers",
                principalColumn: "domain",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the foreign key constraint referring to DomainDeciphers
            migrationBuilder.DropForeignKey(
                name: "FK_DecipherUrlSteps_DomainDeciphers_domain",
                table: "DecipherUrlSteps");

            // Drop the new DomainDeciphers table
            migrationBuilder.DropTable(
                name: "DomainDeciphers");

            // Drop the ValidUrls table
            migrationBuilder.DropTable(
                name: "ValidUrls");

            // Recreate the Urls table (with the same structure as before)
            migrationBuilder.CreateTable(
                name: "Urls",
                columns: table => new
                {
                    domain = table.Column<string>(type: "text", nullable: false),
                    date_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    decipher_method = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Urls", x => x.domain);
                });

            // Re-add the foreign key constraint referring to the Urls table
            migrationBuilder.AddForeignKey(
                name: "FK_DecipherUrlSteps_Urls_domain",
                table: "DecipherUrlSteps",
                column: "domain",
                principalTable: "Urls",
                principalColumn: "domain",
                onDelete: ReferentialAction.Cascade);
        }
    }
}