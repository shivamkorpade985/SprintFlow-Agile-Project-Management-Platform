using Microsoft.AspNetCore.Mvc;
using SprintFlowAPI.DTOs.Stories;
using SprintFlowAPI.Services;

namespace SprintFlowAPI.Controllers;

/// <summary>
/// HTTP controller for User Story operations.
/// Thin controller — all business logic lives in IStoryService.
/// Responsible for: request binding, calling the service, and translating results to HTTP responses.
/// </summary>
[ApiController]
[Produces("application/json")]
public class StoriesController : ControllerBase
{
    private readonly IStoryService _storyService;

    public StoriesController(IStoryService storyService)
    {
        _storyService = storyService ?? throw new ArgumentNullException(nameof(storyService));
    }

    // ============================================================================
    // GET /api/projects/{projectId}/stories
    // ============================================================================

    /// <summary>
    /// Returns all user stories for a project, ordered by creation date descending.
    /// </summary>
    /// <param name="projectId">Numeric project ID.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Collection of stories belonging to the project.</returns>
    [HttpGet("api/projects/{projectId:long}/stories")]
    [ProducesResponseType(typeof(IEnumerable<StoryResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<StoryResponse>>> GetStoriesByProject(
        long projectId,
        CancellationToken cancellationToken)
    {
        try
        {
            var stories = await _storyService.GetStoriesByProjectAsync(projectId, cancellationToken);
            return Ok(stories);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ============================================================================
    // GET /api/stories/{id}
    // ============================================================================

    /// <summary>
    /// Returns a single user story by its numeric ID.
    /// </summary>
    /// <param name="id">Numeric story ID.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Story details if found, otherwise 404.</returns>
    [HttpGet("api/stories/{id:long}")]
    [ProducesResponseType(typeof(StoryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StoryResponse>> GetStoryById(
        long id,
        CancellationToken cancellationToken)
    {
        var story = await _storyService.GetByIdAsync(id, cancellationToken);

        if (story is null)
        {
            return NotFound(new { message = $"Story with ID '{id}' was not found." });
        }

        return Ok(story);
    }

    // ============================================================================
    // POST /api/projects/{projectId}/stories
    // ============================================================================

    /// <summary>
    /// Creates a new user story in the specified project.
    /// </summary>
    /// <param name="projectId">Numeric project ID (from route).</param>
    /// <param name="request">Story creation payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>201 Created with the new story and a Location header.</returns>
    [HttpPost("api/projects/{projectId:long}/stories")]
    [ProducesResponseType(typeof(StoryResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StoryResponse>> CreateStory(
        long projectId,
        [FromBody] CreateStoryRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var story = await _storyService.CreateAsync(projectId, request, cancellationToken);

            return CreatedAtAction(
                nameof(GetStoryById),
                new { id = story.Id },
                story);
        }
        catch (KeyNotFoundException ex)
        {
            // Project not found
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Business rule violation: assignee doesn't exist or isn't a project member
            return BadRequest(new { message = ex.Message });
        }
    }

    // ============================================================================
    // PUT /api/stories/{id}
    // ============================================================================

    /// <summary>
    /// Updates an existing user story.
    /// Used for full story edits and Kanban status changes (both send a complete payload).
    /// </summary>
    /// <param name="id">Numeric story ID.</param>
    /// <param name="request">Updated story payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>204 No Content if updated, 404 if not found, 400 if validation fails.</returns>
    [HttpPut("api/stories/{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStory(
        long id,
        [FromBody] UpdateStoryRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var updated = await _storyService.UpdateAsync(id, request, cancellationToken);

            if (updated is null)
            {
                return NotFound(new { message = $"Story with ID '{id}' was not found." });
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            // Business rule violation: assignee doesn't exist or isn't a project member
            return BadRequest(new { message = ex.Message });
        }
    }

    // ============================================================================
    // DELETE /api/stories/{id}
    // ============================================================================

    /// <summary>
    /// Deletes a user story by its numeric ID.
    /// </summary>
    /// <param name="id">Numeric story ID.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>204 No Content if deleted, 404 if not found.</returns>
    [HttpDelete("api/stories/{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteStory(
        long id,
        CancellationToken cancellationToken)
    {
        var deleted = await _storyService.DeleteAsync(id, cancellationToken);

        if (!deleted)
        {
            return NotFound(new { message = $"Story with ID '{id}' was not found." });
        }

        return NoContent();
    }
}
