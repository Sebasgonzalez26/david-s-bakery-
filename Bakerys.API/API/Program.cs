using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using DA;
using DA.Repositorios;
using Flujo;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
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

app.UseAuthorization();

app.MapControllers();

app.Run();
