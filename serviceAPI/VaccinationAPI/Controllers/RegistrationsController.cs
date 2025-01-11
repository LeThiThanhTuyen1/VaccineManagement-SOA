using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using VaccinationAPI.Data;
using VaccinationAPI.DTOs;
using VaccinationAPI.Models;

namespace VaccinationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RegistrationsController : ControllerBase
    {
        private readonly VaccineDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<RegistrationsController> _logger;

        public RegistrationsController(ILogger<RegistrationsController> logger, VaccineDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        // Phương thức tiện ích để gọi API bên ngoài
        private async Task<T?> FetchFromApiAsync<T>(string clientName, string endpoint, string token)
        {
            try
            {
                var client = _httpClientFactory.CreateClient(clientName);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await client.GetAsync(endpoint);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Lỗi khi gọi API '{clientName}': {response.StatusCode}");
                    return default;
                }

                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<T>(content);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Ngoại lệ khi gọi API '{clientName}' với endpoint '{endpoint}'.");
                return default;
            }
        }

        // GET: api/registrations/all-with-details
        [HttpGet("all-with-details")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllRegistrationsWithDetails()
        {
            var token = Request.Headers["Authorization"].ToString()?.Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
                return Unauthorized("Không có token xác thực.");

            // Lấy tất cả đăng ký
            var registrations = await _context.Registrations.ToListAsync();
            if (!registrations.Any())
                return NotFound("Không có đăng ký nào.");

            // Lấy dữ liệu Công dân và Vaccine
            var citizens = await FetchFromApiAsync<List<CitizenDTO>>("CitizenAPI", "/api/Citizens", token);
            var vaccines = await FetchFromApiAsync<List<VaccineDTO>>("VaccineAPI", "/api/Vaccines", token);

            if (citizens == null || vaccines == null)
                return StatusCode(500, "Không thể tải dữ liệu từ hệ thống bên ngoài.");

            // Kết hợp dữ liệu
            var results = registrations.Select(registration =>
            {
                var citizen = citizens.FirstOrDefault(c => c.Id == registration.CitizenId);
                var vaccine = vaccines.FirstOrDefault(v => v.Id == registration.VaccineId);

                return new
                {
                    registration.Id,
                    CitizenName = citizen?.FullName,
                    registration.CitizenId,
                    VaccineName = vaccine?.Name,
                    registration.VaccineId,
                    registration.RegistrationDate,
                    registration.Status
                };
            }).ToList();

            return Ok(results);
        }

        // POST: api/registrations/register
        [HttpPost("register")]
        public async Task<IActionResult> RegisterVaccination([FromBody] Registration registration)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var token = Request.Headers["Authorization"].ToString()?.Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
                return Unauthorized("Không có token xác thực.");

            // Kiểm tra công dân và vaccine
            var citizen = await FetchFromApiAsync<CitizenDTO>("CitizenAPI", $"/api/Citizens/{registration.CitizenId}", token);
            if (citizen == null)
                return BadRequest("Công dân không tồn tại.");

            var vaccine = await FetchFromApiAsync<VaccineDTO>("VaccineAPI", $"/api/Vaccines/{registration.VaccineId}", token);
            if (vaccine == null)
                return BadRequest("Vaccine không tồn tại.");

            registration.RegistrationDate = DateTime.UtcNow;
            registration.Status = "Pending";

            _context.Registrations.Add(registration);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRegistrationWithDetails), new { id = registration.Id }, registration);
        }

        // GET: api/registrations/{id}/with-details
        [HttpGet("{id}/with-details")]
        public async Task<ActionResult<object>> GetRegistrationWithDetails(long id)
        {
            var token = Request.Headers["Authorization"].ToString()?.Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
                return Unauthorized("Không có token xác thực.");

            var registration = await _context.Registrations.FirstOrDefaultAsync(r => r.Id == id);
            if (registration == null)
                return NotFound("Không tìm thấy đăng ký.");

            var citizen = await FetchFromApiAsync<CitizenDTO>("CitizenAPI", $"/api/Citizens/{registration.CitizenId}", token);
            var vaccine = await FetchFromApiAsync<VaccineDTO>("VaccineAPI", $"/api/Vaccines/{registration.VaccineId}", token);

            var result = new
            {
                registration.Id,
                CitizenName = citizen?.FullName,
                registration.CitizenId,
                VaccineName = vaccine?.Name,
                registration.VaccineId,
                registration.RegistrationDate,
                registration.Status
            };

            return Ok(result);
        }

        // GET: api/registrations/filter
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<object>>> FilterRegistrations([FromQuery] string? status, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] long? citizenId)
        {
            var query = _context.Registrations.AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(r => r.Status == status);

            if (fromDate.HasValue)
                query = query.Where(r => r.RegistrationDate >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(r => r.RegistrationDate <= toDate.Value);

            if (citizenId.HasValue)
                query = query.Where(r => r.CitizenId == citizenId.Value);

            var registrations = await query.ToListAsync();

            if (!registrations.Any())
                return NotFound("Không tìm thấy đăng ký nào phù hợp.");

            var results = registrations.Select(r => new
            {
                r.Id,
                r.CitizenId,
                r.VaccineId,
                r.RegistrationDate,
                r.Status
            });

            return Ok(results);
        }

        // POST: api/registrations/create-schedule
        //[HttpPost("create-schedule")]
        //public async Task<IActionResult> CreateVaccinationSchedule([FromBody] VaccinationScheduleDTO scheduleDto)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    // Lấy thông tin đăng ký
        //    var registration = await _context.Registrations.FirstOrDefaultAsync(r => r.Id == scheduleDto.RegistrationId);
        //    if (registration == null)
        //        return NotFound("Đăng ký không tồn tại.");

        //    if (registration.Status != "Pending")
        //        return BadRequest("Đăng ký không hợp lệ để tạo lịch tiêm.");

        //    // Lấy thông tin công dân và vaccine
        //    var vaccine = await _context.Vaccines.FirstOrDefaultAsync(v => v.Id == registration.VaccineId);
        //    if (vaccine == null || vaccine.Quantity <= 0)
        //        return BadRequest("Vaccine không đủ số lượng.");

        //    // Kiểm tra lịch tiêm có trùng lặp không
        //    var existingHistory = await _context.VaccinationHistories
        //        .FirstOrDefaultAsync(h => h.CitizenId == registration.CitizenId && h.VaccineId == registration.VaccineId);

        //    if (existingHistory != null)
        //        return BadRequest("Công dân đã được tiêm vaccine này.");

        //    // Thêm lịch sử tiêm vào bảng VaccinationHistory
        //    var vaccinationHistory = new VaccinationHistory
        //    {
        //        CitizenId = registration.CitizenId,
        //        VaccineId = registration.VaccineId,
        //        VaccinationDate = scheduleDto.VaccinationDate,
        //        Status = "Scheduled" // Trạng thái lịch tiêm
        //    };

        //    _context.VaccinationHistories.Add(vaccinationHistory);

        //    // Cập nhật trạng thái đăng ký
        //    registration.Status = "Scheduled";

        //    // Giảm số lượng vaccine
        //    vaccine.Quantity -= 1;

        //    // Lưu thay đổi vào cơ sở dữ liệu
        //    await _context.SaveChangesAsync();

        //    return Ok(new
        //    {
        //        Message = "Lịch tiêm đã được tạo thành công.",
        //        VaccinationHistory = vaccinationHistory
        //    });
        //}
    }
}
