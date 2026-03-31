using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FIM.Server.Migrations
{
    /// <inheritdoc />
    public partial class BetterIndexForPublicFilament : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_PublicFilament_Sort_ColorHex",
                table: "PublicFilamentCatalogs",
                columns: new[] { "ColorHex", "Id" });

            migrationBuilder.CreateIndex(
                name: "IX_PublicFilament_Sort_Diameter",
                table: "PublicFilamentCatalogs",
                columns: new[] { "Diameter", "Id" });

            migrationBuilder.CreateIndex(
                name: "IX_PublicFilament_Sort_Material",
                table: "PublicFilamentCatalogs",
                columns: new[] { "Material", "Id" });

            migrationBuilder.CreateIndex(
                name: "IX_PublicFilament_Sort_Name",
                table: "PublicFilamentCatalogs",
                columns: new[] { "Name", "Id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PublicFilament_Sort_ColorHex",
                table: "PublicFilamentCatalogs");

            migrationBuilder.DropIndex(
                name: "IX_PublicFilament_Sort_Diameter",
                table: "PublicFilamentCatalogs");

            migrationBuilder.DropIndex(
                name: "IX_PublicFilament_Sort_Material",
                table: "PublicFilamentCatalogs");

            migrationBuilder.DropIndex(
                name: "IX_PublicFilament_Sort_Name",
                table: "PublicFilamentCatalogs");

            migrationBuilder.AddCheckConstraint(
                name: "CK_PublicFilament_ColorHexes_IsJsonArray",
                table: "PublicFilamentCatalogs",
                sql: "[ColorHexes] IS NULL OR (ISJSON([ColorHexes]) = 1 AND LEFT(LTRIM([ColorHexes]), 1) = '[')");
        }
    }
}
