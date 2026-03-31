using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FIM.Server.Migrations
{
    /// <inheritdoc />
    public partial class FilamentCatalogConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE [PublicFilamentCatalogs]
                SET
                    [Name] = LEFT([Name], 50),
                    [Material] = LEFT([Material], 50),
                    [Identifier] = LEFT([Identifier], 200),
                    [Finish] = CASE WHEN [Finish] IS NULL THEN NULL ELSE LEFT([Finish], 50) END,
                    [Brand] = LEFT([Brand], 100),
                    [ColorHex] = CASE
                        WHEN [ColorHex] IS NULL THEN NULL
                        WHEN LEN(LTRIM(RTRIM([ColorHex]))) = 0 THEN NULL
                        WHEN LEN(LTRIM(RTRIM([ColorHex]))) > 8 THEN NULL
                        ELSE LTRIM(RTRIM([ColorHex]))
                    END
                WHERE
                    LEN([Name]) > 50
                    OR LEN([Material]) > 50
                    OR LEN([Identifier]) > 200
                    OR ([Finish] IS NOT NULL AND LEN([Finish]) > 50)
                    OR LEN([Brand]) > 100
                    OR ([ColorHex] IS NOT NULL AND
                        (
                            LEN(LTRIM(RTRIM([ColorHex]))) = 0
                            OR LEN(LTRIM(RTRIM([ColorHex]))) > 8
                            OR [ColorHex] <> LTRIM(RTRIM([ColorHex]))
                        )
                    )
                ;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Material",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Identifier",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Finish",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ColorHex",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Brand",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddCheckConstraint(
                name: "CK_PublicFilament_BedTemp_Range",
                table: "PublicFilamentCatalogs",
                sql: "[BedTemp] IS NULL OR ([BedTemp] >= 0 AND [BedTemp] <= 200)");

            migrationBuilder.AddCheckConstraint(
                name: "CK_PublicFilament_Diameter_Range",
                table: "PublicFilamentCatalogs",
                sql: "[Diameter] > 0 AND [Diameter] <= 10");

            migrationBuilder.AddCheckConstraint(
                name: "CK_PublicFilament_ExtruderTemp_Range",
                table: "PublicFilamentCatalogs",
                sql: "[ExtruderTemp] IS NULL OR ([ExtruderTemp] >= 0 AND [ExtruderTemp] <= 500)");

            migrationBuilder.AddCheckConstraint(
                name: "CK_PublicFilament_Weight_Positive",
                table: "PublicFilamentCatalogs",
                sql: "[Weight] > 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_PublicFilament_BedTemp_Range",
                table: "PublicFilamentCatalogs");

            migrationBuilder.DropCheckConstraint(
                name: "CK_PublicFilament_Diameter_Range",
                table: "PublicFilamentCatalogs");

            migrationBuilder.DropCheckConstraint(
                name: "CK_PublicFilament_ExtruderTemp_Range",
                table: "PublicFilamentCatalogs");

            migrationBuilder.DropCheckConstraint(
                name: "CK_PublicFilament_Weight_Positive",
                table: "PublicFilamentCatalogs");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Material",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Identifier",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Finish",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ColorHex",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(8)",
                oldMaxLength: 8,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Brand",
                table: "PublicFilamentCatalogs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);
        }
    }
}
