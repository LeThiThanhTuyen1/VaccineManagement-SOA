using Microsoft.EntityFrameworkCore;
using VaccineAPI.Models;

namespace VaccineAPI.Data
{
    public class VaccineDbContext : DbContext
    {
        public VaccineDbContext(DbContextOptions<VaccineDbContext> options) : base(options) { }

        public DbSet<Vaccine> Vaccines { get; set; }
        public DbSet<VaccineDetail> VaccineDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Cấu hình bảng Vaccine
            modelBuilder.Entity<Vaccine>(entity =>
            {
                entity.HasKey(v => v.Id);
                entity.ToTable("vaccines");  
                entity.HasMany(v => v.VaccineDetails)
                      .WithOne(d => d.Vaccine)
                      .HasForeignKey(d => d.VaccineId)
                      .OnDelete(DeleteBehavior.Cascade); 
            });

            // Cấu hình bảng VaccineDetail
            modelBuilder.Entity<VaccineDetail>(entity =>
            {
                entity.HasKey(d => d.DetailId);
                entity.ToTable("vaccine_details");
            });
        }
    }
}
