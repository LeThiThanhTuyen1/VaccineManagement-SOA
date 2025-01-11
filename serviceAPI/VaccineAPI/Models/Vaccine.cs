using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace VaccineAPI.Models
{
    public class Vaccine
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("manufacturer")]
        public string? Manufacturer { get; set; }

        [Column("expiration_date")]
        public DateTime? ExpirationDate { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [JsonIgnore]
        public ICollection<VaccineDetail>? VaccineDetails { get; set; }
    }
}
