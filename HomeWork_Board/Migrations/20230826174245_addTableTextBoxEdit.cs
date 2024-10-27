using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeWork_Board.Migrations
{
    /// <inheritdoc />
    public partial class addTableTextBoxEdit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "TextBox",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Left",
                table: "TextBox",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Top",
                table: "TextBox",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "TextBox");

            migrationBuilder.DropColumn(
                name: "Left",
                table: "TextBox");

            migrationBuilder.DropColumn(
                name: "Top",
                table: "TextBox");
        }
    }
}
