using SprintFlowAPI.Models;

namespace SprintFlowAPI.Repositories;

/// <summary>
/// Repository interface defining data access operations for ProjectMember associations.
/// Pure data access only — no business logic.
/// </summary>
public interface IProjectMemberRepository
{
    Task<IEnumerable<ProjectMember>> GetMembersByProjectIdAsync(long projectId, CancellationToken cancellationToken = default);
    Task<ProjectMember?> GetMembershipAsync(long projectId, long userId, CancellationToken cancellationToken = default);
    Task<bool> IsMemberAsync(long projectId, long userId, CancellationToken cancellationToken = default);
    Task<ProjectMember> AddMemberAsync(ProjectMember member, CancellationToken cancellationToken = default);
    Task<bool> RemoveMemberAsync(long projectId, long userId, CancellationToken cancellationToken = default);
    Task<bool> ProjectExistsAsync(long projectId, CancellationToken cancellationToken = default);
    Task<bool> UserExistsAsync(long userId, CancellationToken cancellationToken = default);
}
