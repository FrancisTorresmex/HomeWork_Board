using HomeWork_Board.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeWork_Board.Database
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<TaskModel> Task { get; set; }
        public DbSet<TextBoxModel> TextBox { get; set; }
    }
}
