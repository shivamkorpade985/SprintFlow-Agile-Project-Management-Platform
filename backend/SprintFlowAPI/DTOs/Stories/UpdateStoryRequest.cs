using System.ComponentModel.DataAnnotations;
using SprintFlowAPI.Models;

namespace SprintFlowAPI.DTOs.Stories;

/// <summary>
/// DTO for updating an existing User Story.
/// The project cannot be changed via update — projectId is not included.
/// All fields are required to provide a full replacement (not a partial patch).
/// This matches the Kanban board's status-change behavior which sends a full payload.
/// </summary>
public class UpdateStoryRequest
{
    [Required(ErrorMessage = "Story title is required.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Story title must be between 1 and 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Story description is required.")]
    [StringLength(2000, MinimumLength = 1, ErrorMessage = "Story description must be between 1 and 2000 characters.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Story priority is required.")]
    public StoryPriority Priority { get; set; }

    [Range(1, 100, ErrorMessage = "Story points must be a positive whole number between 1 and 100.")]
    public int StoryPoints { get; set; }

    /// <summary>
    /// Optional. If provided, the user must still be a member of the story's project.
    /// Passing null clears the assignment (unassigned).
    /// </summary>
    public long? AssignedUserId { get; set; }

    [Required(ErrorMessage = "Story status is required.")]
    public StoryStatus Status { get; set; }
}
