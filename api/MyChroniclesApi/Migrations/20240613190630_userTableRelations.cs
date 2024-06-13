using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyChroniclesApi.Migrations.UsersServiceMigrations
{
    /// <inheritdoc />
    public partial class userTableRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "user_id",
                table: "user_history",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<string>(
                name: "user_id",
                table: "user_chronicles",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<float>(
                name: "rating",
                table: "user_chronicles",
                type: "real",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "episode",
                table: "user_chronicles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "source",
                table: "user_chronicles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "user_chronicles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Chronicles",
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
                    table.PrimaryKey("PK_Chronicles", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_user_history_user_id",
                table: "user_history",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_chronicles_book_id",
                table: "user_chronicles",
                column: "book_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_chronicles_user_id",
                table: "user_chronicles",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_user_chronicles_AspNetUsers_user_id",
                table: "user_chronicles",
                column: "user_id",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_chronicles_Chronicles_book_id",
                table: "user_chronicles",
                column: "book_id",
                principalTable: "Chronicles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_history_AspNetUsers_user_id",
                table: "user_history",
                column: "user_id",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_chronicles_AspNetUsers_user_id",
                table: "user_chronicles");

            migrationBuilder.DropForeignKey(
                name: "FK_user_chronicles_Chronicles_book_id",
                table: "user_chronicles");

            migrationBuilder.DropForeignKey(
                name: "FK_user_history_AspNetUsers_user_id",
                table: "user_history");

            migrationBuilder.DropTable(
                name: "Chronicles");

            migrationBuilder.DropIndex(
                name: "IX_user_history_user_id",
                table: "user_history");

            migrationBuilder.DropIndex(
                name: "IX_user_chronicles_book_id",
                table: "user_chronicles");

            migrationBuilder.DropIndex(
                name: "IX_user_chronicles_user_id",
                table: "user_chronicles");

            migrationBuilder.DropColumn(
                name: "episode",
                table: "user_chronicles");

            migrationBuilder.DropColumn(
                name: "source",
                table: "user_chronicles");

            migrationBuilder.DropColumn(
                name: "status",
                table: "user_chronicles");

            migrationBuilder.AlterColumn<Guid>(
                name: "user_id",
                table: "user_history",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<Guid>(
                name: "user_id",
                table: "user_chronicles",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<int>(
                name: "rating",
                table: "user_chronicles",
                type: "integer",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");
        }
    }
}
