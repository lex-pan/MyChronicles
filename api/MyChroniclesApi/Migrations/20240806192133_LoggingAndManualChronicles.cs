using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    /// <inheritdoc />
    public partial class LoggingAndManualChronicles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "length",
                table: "Chronicles",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "ChronicleChanges",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    editLogId = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "text", nullable: true),
                    author = table.Column<string>(type: "text", nullable: true),
                    category = table.Column<string>(type: "text", nullable: true),
                    episodes = table.Column<float>(type: "real", nullable: true),
                    length = table.Column<string>(type: "text", nullable: true),
                    country = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "text", nullable: true),
                    start_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    end_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    synopsis = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChronicleChanges", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ChronicleEditsLog",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    changes_id = table.Column<Guid>(type: "uuid", nullable: false),
                    chronicle_id = table.Column<Guid>(type: "uuid", nullable: false),
                    action = table.Column<string>(type: "text", nullable: false),
                    source = table.Column<string>(type: "text", nullable: false),
                    changed_dataid = table.Column<Guid>(type: "uuid", nullable: false),
                    date_of_action = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChronicleEditsLog", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChronicleEditsLog_ChronicleChanges_changed_dataid",
                        column: x => x.changed_dataid,
                        principalTable: "ChronicleChanges",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChronicleEditsLog_ChronicleChanges_changes_id",
                        column: x => x.changes_id,
                        principalTable: "ChronicleChanges",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChronicleEditsLog_changed_dataid",
                table: "ChronicleEditsLog",
                column: "changed_dataid");

            migrationBuilder.CreateIndex(
                name: "IX_ChronicleEditsLog_changes_id",
                table: "ChronicleEditsLog",
                column: "changes_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChronicleEditsLog");

            migrationBuilder.DropTable(
                name: "ChronicleChanges");

            migrationBuilder.AlterColumn<int>(
                name: "length",
                table: "Chronicles",
                type: "integer",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
