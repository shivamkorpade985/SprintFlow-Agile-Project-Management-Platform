using System.ComponentModel.DataAnnotations;
using SprintFlowAPI.Models;

namespace SprintFlowAPI.DTOs.Stories;

/// <summary>
/// DTO for creating a new User Story.
/// Note: projectId is sourced from the route (POST /api/projects/{projectId}/stories),
/// not from the request body, to avoid duplication and ensure project scoping.
/// </summary>
public class CreateStoryRequest
{
    [Required(ErrorMessage = "Story title is required.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Story title must be between 1 and 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Story description is required.")]
    [StringLength(2000, MinimumLength = 1, ErrorMessage = "Story description must be between 1 and 2000 characters.")]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Priority level. Deserialized from string JSON values: "LOW", "MEDIUM", "HIGH".
    /// Invalid values produce a 400 Bad Request automatically via JsonStringEnumConverter.
    /// </summary>
    [Required(ErrorMessage = "Story priority is required.")]
    public StoryPriority Priority { get; set; } = StoryPriority.MEDIUM;

    /// <summary>
    /// Effort estimate. Must be a positive integer between 1 and 100.
    /// </summary>
    [Range(1, 100, ErrorMessage = "Story points must be a positive whole number between 1 and 100.")]
    public int StoryPoints { get; set; }

    /// <summary>
    /// Optional. If provided, the user must be a member of the target project.
    /// This is enforced by StoryService, not by a DataAnnotation.
    /// </summary>
    public long? AssignedUserId { get; set; }

    /// <summary>
    /// Initial workflow status. Defaults to BACKLOG matching frontend default behaviour.
    /// </summary>
    [Required(ErrorMessage = "Story status is required.")]
    public StoryStatus Status { get; set; } = StoryStatus.BACKLOG;
}
