using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net.Http;
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

        // POST: api/registrations/register
        [HttpPost("register")]
        public async Task<IActionResult> RegisterVaccination([FromBody] Registration registration)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Lấy token từ header
            var token = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Không có token xác thực.");
            }

            try
            {
                // Gọi AuthAPI để kiểm tra công dân
                var citizenClient = _httpClientFactory.CreateClient("CitizenAPI");
                citizenClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.Replace("Bearer ", ""));
                var citizenResponse = await citizenClient.GetAsync($"/api/Citizens/{registration.CitizenId}");
                if (!citizenResponse.IsSuccessStatusCode)
                {
                    return BadRequest("Công dân không tồn tại.");
                }

                // Gọi VaccineAPI để kiểm tra vaccine
                var vaccineClient = _httpClientFactory.CreateClient("VaccineAPI");
                vaccineClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.Replace("Bearer ", ""));
                var vaccineResponse = await vaccineClient.GetAsync($"/api/Vaccines/{registration.VaccineId}");
                if (!vaccineResponse.IsSuccessStatusCode)
                {
                    return BadRequest("Vaccine không tồn tại.");
                }

                registration.RegistrationDate = DateTime.UtcNow;
                registration.Status = "Pending";

                _context.Registrations.Add(registration);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRegistrationWithDetails), new { id = registration.Id }, registration);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi ngoại lệ khi đăng ký tiêm chủng.");
                return StatusCode(500, "Đã xảy ra lỗi khi xử lý yêu cầu.");
            }
        }

        // GET: api/registrations/{id}/with-details
        [HttpGet("{id}/with-details")]
        public async Task<ActionResult<object>> GetRegistrationWithDetails(long id)
        {
            // Lấy thông tin đăng ký từ cơ sở dữ liệu
            var registration = await _context.Registrations.FirstOrDefaultAsync(r => r.Id == id);
            if (registration == null)
            {
                return NotFound("Không tìm thấy đăng ký.");
            }

            // Lấy token từ header
            var token = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Không có token xác thực.");
            }

            var citizenClient = _httpClientFactory.CreateClient("CitizenAPI");
            citizenClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.Replace("Bearer ", ""));
            var citizenResponse = await citizenClient.GetAsync($"/api/Citizens/{registration.CitizenId}");

            try
            {
                // Gọi AuthAPI để lấy thông tin công dân
                if (!citizenResponse.IsSuccessStatusCode)
                {
                    var citizenErrorContent = await citizenResponse.Content.ReadAsStringAsync();
                    _logger.LogError($"Lỗi khi gọi API Công dân: {citizenResponse.StatusCode}, Nội dung: {citizenErrorContent}");
                    return BadRequest("Không thể lấy thông tin công dân.");
                }

                var citizenContent = await citizenResponse.Content.ReadAsStringAsync();
                var citizen = JsonConvert.DeserializeObject<CitizenDTO>(citizenContent);

                // Gọi VaccineAPI để lấy thông tin vaccine
                var vaccineClient = _httpClientFactory.CreateClient("VaccineAPI");
                vaccineClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.Replace("Bearer ", ""));
                var vaccineResponse = await vaccineClient.GetAsync($"/api/Vaccines/{registration.VaccineId}");
                
                if (!vaccineResponse.IsSuccessStatusCode)
                {
                    var vaccineErrorContent = await vaccineResponse.Content.ReadAsStringAsync();
                    _logger.LogError($"Lỗi khi gọi API Vaccine: {vaccineResponse.StatusCode}, Nội dung: {vaccineErrorContent}");
                    return BadRequest("Không thể lấy thông tin vaccine.");
                }

                var vaccineContent = await vaccineResponse.Content.ReadAsStringAsync();
                var vaccine = JsonConvert.DeserializeObject<VaccineDTO>(vaccineContent);

                // Kết hợp thông tin đăng ký với công dân và vaccine
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi ngoại lệ khi lấy thông tin chi tiết đăng ký với ID {Id}", id);
                return StatusCode(500, "Đã xảy ra lỗi khi xử lý yêu cầu.");
            }
        }
    }
}
