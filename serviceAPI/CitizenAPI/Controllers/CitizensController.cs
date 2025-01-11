using CitizenAPI.Data;
using CitizenAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace CitizenAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CitizensController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CitizensController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/citizens
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Citizen>>> GetCitizens()
        {
            var citizens = await _context.Citizens
                .Include(c => c.Ward) 
                .ThenInclude(w => w.District) 
                .ThenInclude(d => d.Province)
                .ToListAsync();

            // Tạo địa chỉ đầy đủ
            var citizensWithFullAddress = citizens.Select(citizen => new
            {
                citizen.Id,
                citizen.FullName,
                citizen.DateOfBirth,
                citizen.PhoneNumber,
                FullAddress = $"{citizen.AddressDetail}, {citizen.Ward.Name}, {citizen.Ward.District.Name}, {citizen.Ward.District.Province.Name}"
            }).ToList();

            return Ok(citizensWithFullAddress);
        }

        // GET: api/citizens/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Citizen>> GetCitizen(long id)
        {
            var citizen = await _context.Citizens
                .Include(c => c.Ward) 
                .ThenInclude(w => w.District) 
                .ThenInclude(d => d.Province) 
                .FirstOrDefaultAsync(c => c.Id == id);

            if (citizen == null)
            {
                return NotFound();
            }

            // Tạo địa chỉ đầy đủ
            var citizenWithFullAddress = new
            {
                citizen.Id,
                citizen.FullName,
                citizen.DateOfBirth,
                citizen.PhoneNumber,
                FullAddress = $"{citizen.AddressDetail}, {citizen.Ward.Name}, {citizen.Ward.District.Name}, {citizen.Ward.District.Province.Name}"
            };

            return Ok(citizenWithFullAddress);
        }

        // POST: api/citizens
        [HttpPost]
        public async Task<ActionResult<Citizen>> PostCitizen(Citizen citizen)
        {
            // Kiểm tra xem WardId có tồn tại trong bảng Wards không
            var ward = await _context.Wards
                .Include(w => w.District)  
                .ThenInclude(d => d.Province)  
                .FirstOrDefaultAsync(w => w.Id == citizen.WardId);

            if (ward == null)
            {
                return BadRequest("Không tìm thấy xã");
            }

            // Thêm công dân vào cơ sở dữ liệu
            _context.Citizens.Add(citizen);
            await _context.SaveChangesAsync();

            // Trả về thông tin công dân cùng với địa chỉ đầy đủ
            return CreatedAtAction("GetCitizen", new { id = citizen.Id }, new
            {
                citizen.Id,
                citizen.FullName,
                citizen.DateOfBirth,
                citizen.PhoneNumber,
                citizen.AddressDetail,
                Address = new
                {
                    Ward = ward.Name,
                    District = ward.District.Name,
                    Province = ward.District.Province.Name
                }
            });
        }

        // PUT: api/citizens/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCitizen(long id, Citizen citizen)
        {
            if (id != citizen.Id)
            {
                return BadRequest("Mã công dân không khớp.");
            }

            // Kiểm tra xem WardId có tồn tại trong bảng Wards không
            var ward = await _context.Wards
                .Include(w => w.District)
                .ThenInclude(d => d.Province)
                .FirstOrDefaultAsync(w => w.Id == citizen.WardId);

            if (ward == null)
            {
                return BadRequest("Không tìm thấy xã.");
            }

            // Đảm bảo dữ liệu cập nhật đầy đủ cho Ward
            citizen.Ward = ward;

            _context.Entry(citizen).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CitizenExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/citizens/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCitizen(long id)
        {
            var citizen = await _context.Citizens.FindAsync(id);
            if (citizen == null)
            {
                return NotFound();
            }

            _context.Citizens.Remove(citizen);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CitizenExists(long id)
        {
            return _context.Citizens.Any(e => e.Id == id);
        }
    }
}
