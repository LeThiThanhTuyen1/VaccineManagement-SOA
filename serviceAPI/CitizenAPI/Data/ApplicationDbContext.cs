using CitizenAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CitizenAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Province> Provinces { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<Ward> Wards { get; set; }
        public DbSet<Citizen> Citizens { get; set; }
    }
}
