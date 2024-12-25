using System.Reflection.PortableExecutable;

namespace VaccinationAPI.Models
{
    public class Registration
    {
        public int Id { get; set; }
        public int CitizenId { get; set; }
        public int VaccineId { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string? Status { get; set; } 
    }

}
