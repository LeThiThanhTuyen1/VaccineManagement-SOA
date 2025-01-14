using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CitizenAPI.Data;
using CitizenAPI.Models;

namespace CitizenAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WardsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WardsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Wards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ward>>> GetWards()
        {
            return await _context.Wards.ToListAsync();
        }

        // GET: api/Wards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ward>> GetWard(long id)
        {
            var ward = await _context.Wards.FindAsync(id);

            if (ward == null)
            {
                return NotFound();
            }

            return ward;
        }
        // GET: api/wards/{districtId}
        [HttpGet("{districtId}/wards")]
        public async Task<ActionResult<List<Ward>>> GetWardsByDistrict(long districtId)
        {
            // Fetch wards based on the districtId
            var wards = await _context.Wards
                                      .Where(w => w.DistrictId == districtId)
                                      .ToListAsync();

            if (wards == null || !wards.Any())
            {
                return NotFound("No wards found for this district.");
            }

            return Ok(wards);
        }
    
        // PUT: api/Wards/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWard(long id, Ward ward)
        {
            if (id != ward.Id)
            {
                return BadRequest();
            }

            _context.Entry(ward).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WardExists(id))
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

        // POST: api/Wards
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Ward>> PostWard(Ward ward)
        {
            _context.Wards.Add(ward);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWard", new { id = ward.Id }, ward);
        }

        // DELETE: api/Wards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWard(long id)
        {
            var ward = await _context.Wards.FindAsync(id);
            if (ward == null)
            {
                return NotFound();
            }

            _context.Wards.Remove(ward);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WardExists(long id)
        {
            return _context.Wards.Any(e => e.Id == id);
        }


    }
}
