namespace VaccinationAPI.DTOs
{
    public class VaccineDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public List<VaccineDetailDTO> Details { get; set; }
    }

    public class VaccineDetailDTO
    {
        public long DetailId { get; set; }
        public string ProviderName { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; }
    }

}