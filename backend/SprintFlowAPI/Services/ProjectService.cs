using SprintFlowAPI.DTOs.Projects;
using SprintFlowAPI.Models;
using SprintFlowAPI.Repositories;

namespace SprintFlowAPI.Services;

/// <summary>
/// Application service implementing Project business logic and domain mapping.
/// Orchestrates IProjectRepository and handles business validation.
/// Standard single-write operations rely on EF Core's built-in transaction
/// inside SaveChangesAsync().
/// </summary>
public class ProjectService : IProjectService
{
    private readonly IProjectRepository _projectRepository;
    private readonly ILogger<ProjectService> _logger;

    public ProjectService(IProjectRepository projectRepository, ILogger<ProjectService> logger)
    {
        _projectRepository = projectRepository ?? throw new ArgumentNullException(nameof(projectRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<ProjectResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var projects = await _projectRepository.GetAllAsync(cancellationToken);
        return projects.Select(MapToResponse);
    }

    /// <inheritdoc/>
    public async Task<ProjectResponse?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        var project = await _projectRepository.GetByIdAsync(id, cancellationToken);
        return project is null ? null : MapToResponse(project);
    }

    /// <inheritdoc/>
    public async Task<ProjectResponse> CreateAsync(CreateProjectRequest request, CancellationToken cancellationToken = default)
    {
        var project = new Project
        {
            Name = request.Name.Trim(),
            Description = request.Description.Trim()
        };

        var createdProject = await _projectRepository.CreateAsync(project, cancellationToken);

        _logger.LogInformation("Project {ProjectId} ('{ProjectName}') created.", createdProject.Id, createdProject.Name);

        return MapToResponse(createdProject);
    }

    /// <inheritdoc/>
    public async Task<ProjectResponse?> UpdateAsync(long id, UpdateProjectRequest request, CancellationToken cancellationToken = default)
    {
        var updatedProject = await _projectRepository.UpdateAsync(
            id,
            request.Name.Trim(),
            request.Description.Trim(),
            cancellationToken);

        if (updatedProject is not null)
        {
            _logger.LogInformation("Project {ProjectId} updated.", id);
        }

        return updatedProject is null ? null : MapToResponse(updatedProject);
    }

    /// <inheritdoc/>
    public async Task<bool> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        var deleted = await _projectRepository.DeleteAsync(id, cancellationToken);

        if (deleted)
        {
            _logger.LogInformation("Project {ProjectId} deleted.", id);
        }

        return deleted;
    }

    private static ProjectResponse MapToResponse(Project project)
    {
        return new ProjectResponse
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt
        };
    }
}
