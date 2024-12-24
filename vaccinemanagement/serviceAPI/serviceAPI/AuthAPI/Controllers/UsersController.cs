using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuthAPI.Data;
using AuthAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;

namespace AuthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly VaccineDbContext _context;
        private readonly string _jwtSecret;

        public UsersController(VaccineDbContext context, IConfiguration configuration)
        {
            _context = context;
            _jwtSecret = configuration["Jwt:Secret"];
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            if (user.Username == null || user.Password == null)
            {
                return BadRequest("Tên đăng nhập và mật khẩu không được để trống.");
            }

            var dbUser = _context.Users.SingleOrDefault(u => u.Username == user.Username);
            if (dbUser == null)
            {
                return Unauthorized("Tài khoản không tồn tại.");
            }

            // Kiểm tra mật khẩu
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(user.Password));
                var hashedPassword = Convert.ToBase64String(hashedBytes);
                if (dbUser.Password != hashedPassword)
                {
                    return Unauthorized("Sai mật khẩu.");
                }
            }

            // Tạo token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, dbUser.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            // Lưu token vào nơi khác như trong cache hoặc cơ sở dữ liệu nếu cần thiết

            return Ok(new { Token = tokenHandler.WriteToken(token) });
        }

        // POST: api/Users/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (_context.Users.Any(u => u.Username == user.Username))
            {
                return BadRequest("Tên đăng nhập đã tồn tại.");
            }

            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(user.Password));
                user.Password = Convert.ToBase64String(hashedBytes);
            }

            // Mặc định tài khoản mới tạo sẽ chưa được kích hoạt
            user.Enabled = false;
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("Đăng ký tài khoản thành công. Vui lòng liên hệ quản trị viên để kích hoạt tài khoản.");
        }

        // PUT: api/Users/activate/5
        [HttpPut("activate/{id}")]
        public IActionResult ActivateAccount(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng.");
            }

            if (user.Enabled)
            {
                return BadRequest("Tài khoản đã được kích hoạt.");
            }

            user.Enabled = true;
            _context.SaveChanges();

            return Ok("Tài khoản đã được kích hoạt thành công.");
        }

        // PUT: api/Users/deactivate/5
        [HttpPut("deactivate/{id}")]
        public IActionResult DeactivateAccount(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng.");
            }

            if (!user.Enabled)
            {
                return BadRequest("Tài khoản đã bị vô hiệu hóa.");
            }

            user.Enabled = false;
            _context.SaveChanges();

            return Ok("Tài khoản đã bị vô hiệu hóa thành công.");
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
