using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SprintFlowAPI.Models;

/// <summary>
/// Join entity representing the membership of a User in a Project.
/// Used by StoryService to enforce the business rule:
/// "The assigned user must be a member of the story's project."
/// </summary>
public class ProjectMember
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    /// <summary>
    /// The project this membership belongs to.
    /// </summary>
    public long ProjectId { get; set; }

    /// <summary>
    /// The user who is a member of the project.
    /// </summary>
    public long UserId { get; set; }

    // Navigation properties

    public Project Project { get; set; } = null!;

    public User User { get; set; } = null!;
}