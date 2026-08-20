using System.ComponentModel.DataAnnotations;

namespace SprintFlowAPI.DTOs.Projects;

/// <summary>
/// DTO contract for creating a new project.
/// Aligned with frontend CreateProjectRequest: { name: string, description: string }
/// </summary>
public class CreateProjectRequest
{
    [Required(ErrorMessage = "Project name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Project name must be between 1 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Project description is required.")]
    [StringLength(1000, MinimumLength = 1, ErrorMessage = "Project description must be between 1 and 1000 characters.")]
    public string Description { get; set; } = string.Empty;

}
