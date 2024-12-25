namespace VaccinationAPI.Models
{
    public class VaccinationHistory
    {
        public int Id { get; set; }
        public int CitizenId { get; set; }
        public int VaccineId { get; set; }
        public DateTime VaccinationDate { get; set; }
        public int DoseNumber { get; set; }
        public string? VaccineBatch { get; set; }
    }

}
