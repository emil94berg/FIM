using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FIM.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedSpool : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Color",
                table: "Spools",
                newName: "Identifier");

            migrationBuilder.AddColumn<int>(
                name: "BedTemp",
                table: "Spools",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ColorHex",
                table: "Spools",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ColorHexes",
                table: "Spools",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ColorName",
                table: "Spools",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ExtruderTemp",
                table: "Spools",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Finish",
                table: "Spools",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Glow",
                table: "Spools",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Translucent",
                table: "Spools",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BedTemp",
                table: "Spools");

            migrationBuilder.DropColumn(
                name: "ColorHex",
                table: "Spools");

            migrationBuilder.DropColumn(
                name: "ColorHexes",
                table: "Spools");

            migrationBuilder.DropColumn(
                name: "ColorName",
                table: "Spools");

            migrationBuilder.DropColumn(
                name: "ExtruderTemp",
                table: "Spools");

            migrationBuilder.DropColumn(
                name: "Finish",
                table: "Spools");

            migrationBuilder.DropColumn(
                name: "Glow",
                table: "Spools");

            migrationBuilder.DropColumn(
                name: "Translucent",
                table: "Spools");

            migrationBuilder.RenameColumn(
                name: "Identifier",
                table: "Spools",
                newName: "Color");
        }
    }
}
