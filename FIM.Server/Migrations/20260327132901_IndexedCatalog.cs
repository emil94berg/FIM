using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FIM.Server.Migrations
{
    /// <inheritdoc />
    public partial class IndexedCatalog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Material",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ColorHex",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PublicFilament_ColorHex",
                table: "PublicFilamentCatalogs",
                column: "ColorHex");

            migrationBuilder.CreateIndex(
                name: "IX_PublicFilament_Diameter",
                table: "PublicFilamentCatalogs",
                column: "Diameter");

            migrationBuilder.CreateIndex(
                name: "IX_PublicFilament_Id",
                table: "PublicFilamentCatalogs",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_PublicFilament_Material",
                table: "PublicFilamentCatalogs",
                column: "Material");

            migrationBuilder.CreateIndex(
                name: "IX_PublicFilament_Name",
                table: "PublicFilamentCatalogs",
                column: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PublicFilament_ColorHex",
                table: "PublicFilamentCatalogs");

            migrationBuilder.DropIndex(
                name: "IX_PublicFilament_Diameter",
                table: "PublicFilamentCatalogs");

            migrationBuilder.DropIndex(
                name: "IX_PublicFilament_Id",
                table: "PublicFilamentCatalogs");

            migrationBuilder.DropIndex(
                name: "IX_PublicFilament_Material",
                table: "PublicFilamentCatalogs");

            migrationBuilder.DropIndex(
                name: "IX_PublicFilament_Name",
                table: "PublicFilamentCatalogs");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Material",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "ColorHex",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
