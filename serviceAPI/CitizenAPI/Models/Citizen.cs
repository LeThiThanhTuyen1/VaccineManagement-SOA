using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CitizenAPI.Models
{
    [Table("citizens")]
    public class Citizen
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("full_name")]
        public string? FullName { get; set; }

        [Column("date_of_birth")]
        public DateTime DateOfBirth { get; set; }

        [Column("phone_number")]
        public string? PhoneNumber { get; set; }

        [Column("ward_id")]
        public long WardId { get; set; } 

        public virtual Ward? Ward { get; set; }  

        [Column("address_detail")]
        public string? AddressDetail { get; set; }

        [Column("target_group")]
        public string? TargetGroup { get; set; }
    }
}
