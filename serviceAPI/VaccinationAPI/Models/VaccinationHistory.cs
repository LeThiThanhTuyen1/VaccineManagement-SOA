using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VaccinationAPI.Models
{
    [Table("vaccination_history")]
    public class VaccinationHistory
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("citizen_id")]
        public long CitizenId { get; set; }

        [Column("vaccine_id")]
        public long VaccineId { get; set; }

        [Column("vaccination_date")]
        public DateTime VaccinationDate { get; set; }

        [Column("status")]
        public String? Status { get; set; }
    }

}
