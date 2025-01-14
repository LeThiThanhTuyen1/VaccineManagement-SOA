using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VaccineAPI.Data;
using VaccineAPI.Models;

namespace VaccineAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VaccinesController : ControllerBase
    {
        private readonly VaccineDbContext _context;

        public VaccinesController(VaccineDbContext context)
        {
            _context = context;
        }

        // GET: api/Vaccines
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetVaccinesWithDetails()
        {
            var vaccines = await _context.Vaccines
                .Include(v => v.VaccineDetails)  
                .Select(v => new
                {
                    v.Id,
                    v.Name,
                    v.Manufacturer,
                    v.ExpirationDate,
                    v.Quantity,
                    v.Description,
                    Details = v.VaccineDetails.Select(d => new
                    {
                        d.DetailId,
                        d.ProviderName,
                        d.Price,
                        d.Status
                    }).ToList()
                }).ToListAsync();

            return Ok(vaccines);
        }

        // GET: api/Vaccines/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<object>> GetVaccineById(long id)
        {
            var vaccine = await _context.Vaccines
                .Include(v => v.VaccineDetails) 
                .Select(v => new
                {
                    v.Id,
                    v.Name,
                    v.Manufacturer,
                    v.ExpirationDate,
                    v.Quantity,
                    v.Description,
                    Details = v.VaccineDetails.Select(d => new
                    {
                        d.DetailId,
                        d.ProviderName,
                        d.Price,
                        d.Status
                    }).ToList()
                })
                .FirstOrDefaultAsync(v => v.Id == id);

            if (vaccine == null)
            {
                return NotFound("Không tìm thấy vắc xin.");
            }

            return Ok(vaccine);
        }

        // POST: api/Vaccines
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<Vaccine>> PostVaccine([FromBody] Vaccine vaccine)
        {
            if (vaccine == null)
            {
                return BadRequest("Dữ liệu vaccine không hợp lệ.");
            }

            if (vaccine.VaccineDetails == null || !vaccine.VaccineDetails.Any())
            {
                vaccine.VaccineDetails = new List<VaccineDetail>();
            }

            _context.Vaccines.Add(vaccine);

            foreach (var detail in vaccine.VaccineDetails)
            {
                detail.VaccineId = vaccine.Id; // Đảm bảo VaccineId được gán đúng
            }

            await _context.SaveChangesAsync(); // Chỉ gọi SaveChangesAsync một lần

            return CreatedAtAction(nameof(GetVaccinesWithDetails), new { id = vaccine.Id }, vaccine);
        }

        // PUT: api/Vaccines/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> PutVaccine(long id, [FromBody] Vaccine vaccine)
        {
            if (id != vaccine.Id)
            {
                return BadRequest("ID không khớp.");
            }

            var existingVaccine = await _context.Vaccines.FindAsync(id);
            if (existingVaccine == null)
            {
                return NotFound("Vắc xin không tồn tại.");
            }

            existingVaccine.Name = vaccine.Name;
            existingVaccine.Manufacturer = vaccine.Manufacturer;
            existingVaccine.ExpirationDate = vaccine.ExpirationDate;
            existingVaccine.Quantity = vaccine.Quantity;
            existingVaccine.Description = vaccine.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Vaccines/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteVaccine(int id)
        {
            var vaccine = await _context.Vaccines
                .Include(v => v.VaccineDetails)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (vaccine == null)
            {
                return NotFound("Không tìm thấy vaccine.");
            }

            // Xóa các VaccineDetails liên quan trước
            _context.VaccineDetails.RemoveRange(vaccine.VaccineDetails);

            // Xóa vaccine
            _context.Vaccines.Remove(vaccine);

            await _context.SaveChangesAsync();

            return NoContent(); // Trả về phản hồi thành công (204 No Content)
        }

        // POST: api/Vaccines/{id}/details
        [HttpPost("{id}/details")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<VaccineDetail>> PostVaccineDetail(long id, [FromBody] VaccineDetail detail)
        {
            var vaccine = await _context.Vaccines.FindAsync(id);
            if (vaccine == null)
            {
                return NotFound("Vắc xin không tồn tại.");
            }

            detail.VaccineId = id;
            _context.VaccineDetails.Add(detail);
            await _context.SaveChangesAsync();
            return Ok(detail);
        }

        // PUT: api/Vaccines/{id}/details/{detailId}
        [HttpPut("{id}/details/{detailId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> PutVaccineDetail(long id, long detailId, [FromBody] VaccineDetail detail)
        {
            if (detailId != detail.DetailId)
            {
                return BadRequest("ID chi tiết không khớp.");
            }

            var existingDetail = await _context.VaccineDetails.FindAsync(detailId);
            if (existingDetail == null || existingDetail.VaccineId != id)
            {
                return NotFound("Chi tiết vắc xin không tồn tại.");
            }

            existingDetail.ProviderName = detail.ProviderName;
            existingDetail.Price = detail.Price;
            existingDetail.Status = detail.Status;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Vaccines/{id}/details/{detailId}
        [HttpDelete("{id}/details/{detailId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteVaccineDetail(long id, long detailId)
        {
            var detail = await _context.VaccineDetails.FindAsync(detailId);
            if (detail == null || detail.VaccineId != id)
            {
                return NotFound("Chi tiết vắc xin không tồn tại.");
            }

            _context.VaccineDetails.Remove(detail);
            await _context.SaveChangesAsync();
            return Ok("Xóa chi tiết vắc xin thành công.");
        }
    }
}
