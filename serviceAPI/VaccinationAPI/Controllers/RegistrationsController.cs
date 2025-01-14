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
                    registration.Location,
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


            registration.Status = "PENDING";

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
                registration.Location,
                registration.RegistrationDate,
                registration.Status
            };

            return Ok(result);
        }

        // POST: api/registrations/{id}/complete
        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteVaccination(long id)
        {
            var token = Request.Headers["Authorization"].ToString()?.Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
                return Unauthorized("Không có token xác thực.");

            var registration = await _context.Registrations.FirstOrDefaultAsync(r => r.Id == id);
            if (registration == null)
                return NotFound("Không tìm thấy đăng ký.");

            if (registration.Status != "PENDING")
                return BadRequest("Chỉ có thể hoàn thành lịch đăng ký khi trạng thái là PENDING.");

            // Kiểm tra công dân và vaccine trước khi thêm vào lịch sử tiêm chủng
            var citizen = await FetchFromApiAsync<CitizenDTO>("CitizenAPI", $"/api/Citizens/{registration.CitizenId}", token);
            if (citizen == null)
                return BadRequest("Công dân không tồn tại.");

            var vaccine = await FetchFromApiAsync<VaccineDTO>("VaccineAPI", $"/api/Vaccines/{registration.VaccineId}", token);
            if (vaccine == null)
                return BadRequest("Vaccine không tồn tại.");

            // Thêm vào bảng lịch sử tiêm chủng
            var vaccinationHistory = new VaccinationHistory
            {
                CitizenId = registration.CitizenId,
                VaccineId = registration.VaccineId,
                VaccinationDate = DateTime.Now,
                Status = "COMPLETED"
            };

            _context.VaccinationHistories.Add(vaccinationHistory);

            // Cập nhật trạng thái của đăng ký
            registration.Status = "COMPLETED";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Hoàn thành lịch đăng ký tiêm chủng." });
        }

        // POST: api/registrations/{id}/cancel
        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelVaccination(long id)
        {
            var token = Request.Headers["Authorization"].ToString()?.Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
                return Unauthorized("Không có token xác thực.");

            var registration = await _context.Registrations.FirstOrDefaultAsync(r => r.Id == id);
            if (registration == null)
                return NotFound("Không tìm thấy đăng ký.");

            if (registration.Status != "PENDING")
                return BadRequest("Chỉ có thể hủy lịch đăng ký khi trạng thái là PENDING.");

            // Kiểm tra công dân và vaccine trước khi thêm vào lịch sử tiêm chủng
            var citizen = await FetchFromApiAsync<CitizenDTO>("CitizenAPI", $"/api/Citizens/{registration.CitizenId}", token);
            if (citizen == null)
                return BadRequest("Công dân không tồn tại.");

            var vaccine = await FetchFromApiAsync<VaccineDTO>("VaccineAPI", $"/api/Vaccines/{registration.VaccineId}", token);
            if (vaccine == null)
                return BadRequest("Vaccine không tồn tại.");

            // Thêm vào bảng lịch sử tiêm chủng với trạng thái "MISSED"
            var vaccinationHistory = new VaccinationHistory
            {
                CitizenId = registration.CitizenId,
                VaccineId = registration.VaccineId,
                VaccinationDate = DateTime.Now,
                Status = "MISSED"
            };

            _context.VaccinationHistories.Add(vaccinationHistory);

            // Cập nhật trạng thái của đăng ký
            registration.Status = "CANCELLED";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã hủy lịch đăng ký tiêm chủng." });
        }

    }
}
