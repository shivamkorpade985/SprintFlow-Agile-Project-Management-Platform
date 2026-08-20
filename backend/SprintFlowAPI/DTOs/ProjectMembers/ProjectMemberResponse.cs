using SprintFlowAPI.DTOs.Users;

namespace SprintFlowAPI.DTOs.ProjectMembers;

/// <summary>
/// Output DTO returned for project membership associations.
/// Contains membership IDs as well as nested user details for single-query display.
/// </summary>
public class ProjectMemberResponse
{
    public long Id { get; set; }
    public long ProjectId { get; set; }
    public long UserId { get; set; }
    public UserResponse? User { get; set; }
}
