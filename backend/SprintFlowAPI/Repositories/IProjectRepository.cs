using SprintFlowAPI.Models;

namespace SprintFlowAPI.Repositories;

/// <summary>
/// Repository interface defining data access operations for Project entities using numeric IDs.
/// </summary>
public interface IProjectRepository
{
    Task<IEnumerable<Project>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Project?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    Task<Project> CreateAsync(Project project, CancellationToken cancellationToken = default);
    Task<Project?> UpdateAsync(long id, string name, string description, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(long id, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(long id, CancellationToken cancellationToken = default);
}
