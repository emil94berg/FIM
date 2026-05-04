using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FIM.Server.Migrations
{
    /// <inheritdoc />
    public partial class index_forumpost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ForumPosts_CreatedAt",
                table: "ForumPosts",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ForumPosts_Sort_CreatedAt",
                table: "ForumPosts",
                columns: new[] { "CreatedAt", "Id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ForumPosts_CreatedAt",
                table: "ForumPosts");

            migrationBuilder.DropIndex(
                name: "IX_ForumPosts_Sort_CreatedAt",
                table: "ForumPosts");
        }
    }
}
