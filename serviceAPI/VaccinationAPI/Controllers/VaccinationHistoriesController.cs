using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VaccinationAPI.Data;
using VaccinationAPI.Models;

namespace VaccinationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VaccinationHistoriesController : ControllerBase
    {
        private readonly VaccineDbContext _context;

        public VaccinationHistoriesController(VaccineDbContext context)
        {
            _context = context;
        }

        // GET: api/VaccinationHistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VaccinationHistory>>> GetVaccinationHistories()
        {
            return await _context.VaccinationHistories.ToListAsync();
        }

        // POST: api/VaccinationHistories
        [HttpPost]
        public async Task<ActionResult<VaccinationHistory>> PostVaccinationHistory([FromBody] VaccinationHistory history)
        {
            history.VaccinationDate = DateTime.UtcNow;
            _context.VaccinationHistories.Add(history);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVaccinationHistories), new { id = history.Id }, history);
        }
    }
}
