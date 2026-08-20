using System.ComponentModel.DataAnnotations;

namespace SprintFlowAPI.DTOs.ProjectMembers;

/// <summary>
/// DTO contract for adding a user as a member of a project.
/// Note: ProjectId is sourced from the URL route (/api/projects/{projectId}/members).
/// </summary>
public class AddProjectMemberRequest
{
    [Required(ErrorMessage = "UserId is required.")]
    [Range(1, long.MaxValue, ErrorMessage = "A valid positive UserId is required.")]
    public long UserId { get; set; }
}
