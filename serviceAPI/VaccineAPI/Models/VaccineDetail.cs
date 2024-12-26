using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace VaccineAPI.Models
{
    [Table("vaccine_details")]
    public class VaccineDetail
    {
        [Key]
        [Column("detail_id")]
        public long DetailId { get; set; }

        [Column("vaccine_id")]
        public long VaccineId { get; set; }

        [Column("provider_name")]
        public string? ProviderName { get; set; }

        [Column("price")]
        public decimal Price { get; set; }
        [Column("status")]
        public string? Status { get; set; }

        [JsonIgnore]
        public virtual Vaccine? Vaccine { get; set; }
    }
}
