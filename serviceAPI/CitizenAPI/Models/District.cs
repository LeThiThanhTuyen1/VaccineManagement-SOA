using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CitizenAPI.Models
{
    [Table("districts")]
    public class District
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("province_id")]
        public long ProvinceId { get; set; }  

        public Province Province { get; set; }  
    }
}
