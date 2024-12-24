using AuthAPI.Data;
using AuthAPI.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Thêm dịch vụ DbContext với SQL Server
builder.Services.AddDbContext<VaccineDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Cấu hình xác thực JWT
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]);
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

// Thêm dịch vụ Authorization (có thể thêm chính sách quyền nếu cần)
builder.Services.AddAuthorization();

// Thêm controller
builder.Services.AddControllers();

// Thêm Swagger để hỗ trợ API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Cấu hình middleware
app.UseAuthentication();  
app.UseAuthorization();
app.UseMiddleware<JwtMiddleware>();

// Định nghĩa các routes controller
app.MapControllers();

// Cấu hình cổng cho ứng dụng
app.Urls.Add("http://localhost:5100");

app.Run();
