using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using DA;
using DA.Repositorios;
using Flujo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// CORS — permite peticiones desde el frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:3000"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT — valida tokens emitidos por Bakerys.Seguridad
var jwtKey      = builder.Configuration["Token:Key"]!;
var jwtIssuer   = builder.Configuration["Token:Issuer"]!;
var jwtAudience = builder.Configuration["Token:Audience"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAudience,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Repositorio
builder.Services.AddSingleton<IRepositorioDapper, RepositorioDapper>();

// DA
builder.Services.AddScoped<IClienteDA, ClienteDA>();
builder.Services.AddScoped<IPedidoDA, PedidoDA>();
builder.Services.AddScoped<IPagoDA, PagoDA>();
builder.Services.AddScoped<IProductoDA, ProductoDA>();
builder.Services.AddScoped<IMovimientoInventarioDA, MovimientoInventarioDA>();
builder.Services.AddScoped<ITransaccionDA, TransaccionDA>();

// Flujo
builder.Services.AddScoped<IClienteFlujo, ClienteFlujo>();
builder.Services.AddScoped<IPedidoFlujo, PedidoFlujo>();
builder.Services.AddScoped<IPagoFlujo, PagoFlujo>();
builder.Services.AddScoped<IProductoFlujo, ProductoFlujo>();
builder.Services.AddScoped<IMovimientoInventarioFlujo, MovimientoInventarioFlujo>();
builder.Services.AddScoped<ITransaccionFlujo, TransaccionFlujo>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
