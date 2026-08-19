using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SprintFlowAPI.Data;
using SprintFlowAPI.Repositories;
using SprintFlowAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// ============================================================================
// Dependency Injection Configuration
// ============================================================================

// Register DbContext with Scoped lifetime.
// - DbContext is NOT thread-safe; a Scoped lifetime creates one instance per HTTP request,
//   preventing concurrent access and state corruption.
// - Provides Unit of Work change tracking within the HTTP request boundaries.
// - Automatically disposed at the end of each request to avoid connection/memory leaks.
builder.Services.AddDbContext<SprintFlowDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connectionString);
});

// Register Project Repository with Scoped lifetime.
// Rationale:
// - ProjectRepository depends on SprintFlowDbContext (which is Scoped).
// - Services in DI must never have a longer lifetime than their dependencies.
// - Ensures that operations within a single HTTP request share the same repository and context instance.
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();

// Register Story Repository with Scoped lifetime.
// Same rationale as ProjectRepository — depends on the Scoped DbContext.
builder.Services.AddScoped<IStoryRepository, StoryRepository>();

// Register Story Service with Scoped lifetime.
// - StoryService depends on IStoryRepository (which is Scoped).
// - Must also be Scoped to avoid a captive dependency lifetime mismatch.
// - Owns all Story business rules and cross-entity orchestration.
builder.Services.AddScoped<IStoryService, StoryService>();

// Configure Controllers with JSON enum string serialization.
// Rationale: by default System.Text.Json serializes C# enums as integers (0, 1, 2...).
// The frontend expects string literals: "BACKLOG", "IN_PROGRESS", "HIGH", etc.
// JsonStringEnumConverter converts enum values to/from their name strings globally,
// so Priority="HIGH" and Status="BACKLOG" are correctly round-tripped across the API boundary.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// ============================================================================
// HTTP Request Pipeline Configuration
// ============================================================================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontendApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
