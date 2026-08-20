using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SprintFlowAPI.Models;

/// <summary>
/// Represents a system-level User in SprintFlow.
/// Uses numeric BIGINT identifier matching the frontend number ID type.
/// Required for Story assignment FK and ProjectMember membership enforcement.
/// </summary>
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// User role: DEVELOPER, TESTER, or MANAGER.
    /// Stored as a string to match the frontend UserRole union type.
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Role { get; set; } = string.Empty;

    /// <summary>
    /// Optional avatar color preset (hex or named color).
    /// </summary>
    [MaxLength(50)]
    public string? Avatar { get; set; }

    // Navigation properties

    /// <summary>
    /// Stories assigned to this user.
    /// Soft relationship — deleting a user sets Story.AssignedUserId to NULL (not cascade).
    /// </summary>
    public ICollection<Story> AssignedStories { get; set; } = new List<Story>();

    /// <summary>
    /// Project memberships for this user.
    /// </summary>
    public ICollection<ProjectMember> ProjectMemberships { get; set; } = new List<ProjectMember>();
}
