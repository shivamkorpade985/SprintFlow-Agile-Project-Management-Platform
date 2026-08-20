using SprintFlowAPI.DTOs.Projects;

namespace SprintFlowAPI.Services;

/// <summary>
/// Service interface defining Project business operations.
/// Represents the application business boundary for Projects.
/// </summary>
public interface IProjectService
{
    Task<IEnumerable<ProjectResponse>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ProjectResponse?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    Task<ProjectResponse> CreateAsync(CreateProjectRequest request, CancellationToken cancellationToken = default);
    Task<ProjectResponse?> UpdateAsync(long id, UpdateProjectRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(long id, CancellationToken cancellationToken = default);
}
