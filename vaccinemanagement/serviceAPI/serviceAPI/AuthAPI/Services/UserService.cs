using AuthAPI.Models;
using AuthAPI.Data;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthAPI.Services
{
    public class UserService
    {
        private readonly VaccineDbContext _context;
        private readonly IConfiguration _configuration;

        public UserService(VaccineDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Hàm tạo tài khoản với mật khẩu mã hóa
        public async Task<bool> RegisterUser(string username, string password, string role)
        {
            // Kiểm tra xem username có tồn tại không
            if (_context.Users.Any(u => u.Username == username))
            {
                return false; // Username đã tồn tại
            }

            // Mã hóa mật khẩu
            var hashedPassword = HashPassword(password);

            var newUser = new User
            {
                Username = username,
                Password = hashedPassword,
                Role = role,
                Enabled = false // Tài khoản ban đầu chưa được kích hoạt
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return true;
        }

        // Hàm mã hóa mật khẩu
        private string HashPassword(string password)
        {
            byte[] salt = Encoding.UTF8.GetBytes(_configuration["PasswordSalt"]);
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return hashed;
        }

        // Hàm đăng nhập
        public string Login(string username, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == username);

            if (user == null || !VerifyPassword(password, user.Password) || !user.Enabled)
            {
                return null; 
            }

            return GenerateJwtToken(user);
        }

        // Hàm kiểm tra mật khẩu
        private bool VerifyPassword(string password, string hashedPassword)
        {
            var inputHashed = HashPassword(password);
            return inputHashed == hashedPassword;
        }

        // Hàm kích hoạt tài khoản
        public async Task<bool> ActivateAccount(int userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return false;
            }

            user.Enabled = true;
            await _context.SaveChangesAsync();

            return true;
        }

        // Hàm tạo JWT token
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
