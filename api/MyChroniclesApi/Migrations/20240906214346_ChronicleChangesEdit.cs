using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    /// <inheritdoc />
    public partial class ChronicleChangesEdit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChronicleEditsLog_ChronicleChanges_changes_id",
                table: "ChronicleEditsLog");

            migrationBuilder.DropIndex(
                name: "IX_ChronicleEditsLog_changes_id",
                table: "ChronicleEditsLog");

            migrationBuilder.RenameColumn(
                name: "changes_id",
                table: "ChronicleEditsLog",
                newName: "changesid");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.RenameColumn(
                name: "changesid",
                table: "ChronicleEditsLog",
                newName: "changes_id");

            migrationBuilder.CreateIndex(
                name: "IX_ChronicleEditsLog_changes_id",
                table: "ChronicleEditsLog",
                column: "changes_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ChronicleEditsLog_ChronicleChanges_changes_id",
                table: "ChronicleEditsLog",
                column: "changes_id",
                principalTable: "ChronicleChanges",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
