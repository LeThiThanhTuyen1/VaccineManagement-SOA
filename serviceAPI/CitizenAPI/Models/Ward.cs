using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CitizenAPI.Models
{
    [Table("wards")]
    public class Ward
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("district_id")]
        public long DistrictId { get; set; }  

        public District District { get; set; } 
    }
}
