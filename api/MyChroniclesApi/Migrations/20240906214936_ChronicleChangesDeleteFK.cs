using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    /// <inheritdoc />
    public partial class ChronicleChangesDeleteFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChronicleChanges_ChronicleEditsLog_editLogId",
                table: "ChronicleChanges");

            migrationBuilder.DropForeignKey(
                name: "FK_ChronicleEditsLog_ChronicleChanges_changesid",
                table: "ChronicleEditsLog");

            migrationBuilder.DropIndex(
                name: "IX_ChronicleEditsLog_changesid",
                table: "ChronicleEditsLog");

            migrationBuilder.DropIndex(
                name: "IX_ChronicleChanges_editLogId",
                table: "ChronicleChanges");

            migrationBuilder.DropColumn(
                name: "changesid",
                table: "ChronicleEditsLog");

            migrationBuilder.DropColumn(
                name: "editLogId",
                table: "ChronicleChanges");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "changesid",
                table: "ChronicleEditsLog",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "editLogId",
                table: "ChronicleChanges",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_ChronicleEditsLog_changesid",
                table: "ChronicleEditsLog",
                column: "changesid");

            migrationBuilder.CreateIndex(
                name: "IX_ChronicleChanges_editLogId",
                table: "ChronicleChanges",
                column: "editLogId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChronicleChanges_ChronicleEditsLog_editLogId",
                table: "ChronicleChanges",
                column: "editLogId",
                principalTable: "ChronicleEditsLog",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ChronicleEditsLog_ChronicleChanges_changesid",
                table: "ChronicleEditsLog",
                column: "changesid",
                principalTable: "ChronicleChanges",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
