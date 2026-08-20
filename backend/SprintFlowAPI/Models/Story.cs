using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SprintFlowAPI.Models;

/// <summary>
/// Domain entity representing a User Story in SprintFlow.
/// A story is scoped to a Project and can optionally be assigned to a project team member.
/// Uses numeric BIGINT identifier matching the frontend UserStory.id type.
/// </summary>
public class Story
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    /// <summary>
    /// The project this story belongs to. Required — a story cannot exist without a project.
    /// Cascade delete: deleting a project removes all its stories.
    /// </summary>
    public long ProjectId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Priority level. Stored as string in the database via EF Core value conversion.
    /// </summary>
    public StoryPriority Priority { get; set; } = StoryPriority.MEDIUM;

    /// <summary>
    /// Effort estimate in story points. Must be a positive whole number (1–100).
    /// </summary>
    public int StoryPoints { get; set; }

    /// <summary>
    /// Optional assignment to a project team member.
    /// Must be a member of the story's project (enforced by StoryService, not just FK).
    /// SET NULL on delete: deleting a user clears the assignment without deleting the story.
    /// </summary>
    public long? AssignedUserId { get; set; }

    /// <summary>
    /// Workflow status. Stored as string in the database via EF Core value conversion.
    /// </summary>
    public StoryStatus Status { get; set; } = StoryStatus.BACKLOG;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties

    public Project Project { get; set; } = null!;

    public User? AssignedUser { get; set; }
}
