using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FIM.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedDiameterToSpool : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Diameter",
                table: "Spools",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Diameter",
                table: "Spools");
        }
    }
}
