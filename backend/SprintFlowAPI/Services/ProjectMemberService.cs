using SprintFlowAPI.DTOs.ProjectMembers;
using SprintFlowAPI.DTOs.Users;
using SprintFlowAPI.Models;
using SprintFlowAPI.Repositories;

namespace SprintFlowAPI.Services;

/// <summary>
/// Application service implementing Project Member business logic and domain validation.
/// Enforces business rules: project existence, user existence, duplicate prevention, and membership lifecycle.
/// </summary>
public class ProjectMemberService : IProjectMemberService
{
    private readonly IProjectMemberRepository _memberRepository;
    private readonly ILogger<ProjectMemberService> _logger;

    public ProjectMemberService(IProjectMemberRepository memberRepository, ILogger<ProjectMemberService> logger)
    {
        _memberRepository = memberRepository ?? throw new ArgumentNullException(nameof(memberRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IEnumerable<ProjectMemberResponse>> GetMembersByProjectIdAsync(long projectId, CancellationToken cancellationToken = default)
    {
        var projectExists = await _memberRepository.ProjectExistsAsync(projectId, cancellationToken);
        if (!projectExists)
        {
            throw new KeyNotFoundException($"Project with ID '{projectId}' was not found.");
        }

        var members = await _memberRepository.GetMembersByProjectIdAsync(projectId, cancellationToken);
        return members.Select(MapToResponse);
    }

    public async Task<ProjectMemberResponse> AddMemberAsync(long projectId, AddProjectMemberRequest request, CancellationToken cancellationToken = default)
    {
        // Business Rule 1: Project must exist
        var projectExists = await _memberRepository.ProjectExistsAsync(projectId, cancellationToken);
        if (!projectExists)
        {
            throw new KeyNotFoundException($"Project with ID '{projectId}' was not found.");
        }

        // Business Rule 2: User must exist
        var userExists = await _memberRepository.UserExistsAsync(request.UserId, cancellationToken);
        if (!userExists)
        {
            throw new KeyNotFoundException($"User with ID '{request.UserId}' was not found.");
        }

        // Business Rule 3: User cannot already be a member of this project
        var alreadyMember = await _memberRepository.IsMemberAsync(projectId, request.UserId, cancellationToken);
        if (alreadyMember)
        {
            throw new InvalidOperationException($"User with ID '{request.UserId}' is already a member of project '{projectId}'.");
        }

        var member = new ProjectMember
        {
            ProjectId = projectId,
            UserId = request.UserId
        };

        var addedMember = await _memberRepository.AddMemberAsync(member, cancellationToken);
        _logger.LogInformation("User {UserId} added as member to Project {ProjectId}.", request.UserId, projectId);

        return MapToResponse(addedMember);
    }

    public async Task<bool> RemoveMemberAsync(long projectId, long userId, CancellationToken cancellationToken = default)
    {
        // Business Rule 1: Project must exist
        var projectExists = await _memberRepository.ProjectExistsAsync(projectId, cancellationToken);
        if (!projectExists)
        {
            throw new KeyNotFoundException($"Project with ID '{projectId}' was not found.");
        }

        // Business Rule 2: Membership must exist to be removed
        var isMember = await _memberRepository.IsMemberAsync(projectId, userId, cancellationToken);
        if (!isMember)
        {
            throw new KeyNotFoundException($"User with ID '{userId}' is not a member of project '{projectId}'.");
        }

        var removed = await _memberRepository.RemoveMemberAsync(projectId, userId, cancellationToken);
        if (removed)
        {
            _logger.LogInformation("User {UserId} removed from Project {ProjectId}.", userId, projectId);
        }

        return removed;
    }

    private static ProjectMemberResponse MapToResponse(ProjectMember member)
    {
        return new ProjectMemberResponse
        {
            Id = member.Id,
            ProjectId = member.ProjectId,
            UserId = member.UserId,
            User = member.User is null ? null : new UserResponse
            {
                Id = member.User.Id,
                Name = member.User.Name,
                Role = member.User.Role,
                Avatar = member.User.Avatar
            }
        };
    }
}
