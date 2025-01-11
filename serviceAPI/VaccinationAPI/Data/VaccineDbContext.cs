using Microsoft.EntityFrameworkCore;
using VaccinationAPI.Models;

namespace VaccinationAPI.Data
{
    public class VaccineDbContext : DbContext
    {
        public VaccineDbContext(DbContextOptions<VaccineDbContext> options) : base(options) { }

        public DbSet<Registration> Registrations { get; set; }
        public DbSet<VaccinationHistory> VaccinationHistories { get; set; }
    }
}
