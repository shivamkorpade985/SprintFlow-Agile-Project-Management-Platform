using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SprintFlowAPI.Data;
using SprintFlowAPI.Middleware;
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

// Register Repositories with Scoped lifetime.
// Rationale:
// - Repositories depend on SprintFlowDbContext (which is Scoped).
// - Services in DI must never have a longer lifetime than their dependencies (avoiding captive dependencies).
// - Ensures that operations within a single HTTP request share the same repository and context instance.
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IStoryRepository, StoryRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IProjectMemberRepository, ProjectMemberRepository>();

// Register Application Services with Scoped lifetime.
// Rationale:
// - Services represent the application/business logic boundary.
// - Depend on Scoped repositories and participate in the same Scoped DbContext.
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IStoryService, StoryService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProjectMemberService, ProjectMemberService>();

// Configure Controllers with JSON enum string serialization.
// Rationale: by default System.Text.Json serializes C# enums as integers (0, 1, 2...).
// The frontend expects string literals: "BACKLOG", "IN_PROGRESS", "DEVELOPER", "HIGH", etc.
// JsonStringEnumConverter converts enum values to/from their name strings globally,
// so all enum contracts are correctly round-tripped across the API boundary.
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

// Centralized exception handling middleware to catch unhandled unexpected errors,
// log them, and return a clean HTTP 500 JSON response.
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontendApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
