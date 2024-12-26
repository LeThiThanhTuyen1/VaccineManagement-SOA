using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.PortableExecutable;

namespace VaccinationAPI.Models
{
    [Table("registrations")]
    public class Registration
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("citizen_id")]
        public long CitizenId { get; set; }

        [Column("vaccine_id")]
        public long VaccineId { get; set; }

        [Column("registration_date")]
        public DateTime RegistrationDate { get; set; }

        [Column("status")]
        public string? Status { get; set; } 
    }

}
