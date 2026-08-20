using SprintFlowAPI.DTOs.ProjectMembers;

namespace SprintFlowAPI.Services;

/// <summary>
/// Service interface defining Project Member business operations.
/// Represents the business logic and invariant validation boundary for team memberships.
/// </summary>
public interface IProjectMemberService
{
    Task<IEnumerable<ProjectMemberResponse>> GetMembersByProjectIdAsync(long projectId, CancellationToken cancellationToken = default);
    Task<ProjectMemberResponse> AddMemberAsync(long projectId, AddProjectMemberRequest request, CancellationToken cancellationToken = default);
    Task<bool> RemoveMemberAsync(long projectId, long userId, CancellationToken cancellationToken = default);
}
