using Microsoft.AspNetCore.Mvc;
using SprintFlowAPI.DTOs.ProjectMembers;
using SprintFlowAPI.Services;

namespace SprintFlowAPI.Controllers;

[ApiController]
[Produces("application/json")]
public class ProjectMembersController : ControllerBase
{
    private readonly IProjectMemberService _projectMemberService;

    public ProjectMembersController(IProjectMemberService projectMemberService)
    {
        _projectMemberService = projectMemberService ?? throw new ArgumentNullException(nameof(projectMemberService));
    }

    /// <summary>
    /// Gets all team members for a specific project.
    /// </summary>
    [HttpGet("api/projects/{projectId:long}/members")]
    [ProducesResponseType(typeof(IEnumerable<ProjectMemberResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<ProjectMemberResponse>>> GetMembers(long projectId, CancellationToken cancellationToken)
    {
        try
        {
            var members = await _projectMemberService.GetMembersByProjectIdAsync(projectId, cancellationToken);
            return Ok(members);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Adds a user as a member of a project.
    /// </summary>
    [HttpPost("api/projects/{projectId:long}/members")]
    [ProducesResponseType(typeof(ProjectMemberResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ProjectMemberResponse>> AddMember(
        long projectId,
        [FromBody] AddProjectMemberRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var response = await _projectMemberService.AddMemberAsync(projectId, request, cancellationToken);

            return CreatedAtAction(
                nameof(GetMembers),
                new { projectId },
                response
            );
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Removes a user from a project's team membership.
    /// </summary>
    [HttpDelete("api/projects/{projectId:long}/members/{userId:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveMember(long projectId, long userId, CancellationToken cancellationToken)
    {
        try
        {
            var removed = await _projectMemberService.RemoveMemberAsync(projectId, userId, cancellationToken);

            if (!removed)
            {
                return NotFound(new { message = $"User with ID '{userId}' is not a member of project '{projectId}'." });
            }

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
