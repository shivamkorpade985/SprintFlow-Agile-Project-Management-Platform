using System.ComponentModel.DataAnnotations;
using SprintFlowAPI.Models;

namespace SprintFlowAPI.DTOs.Users;

/// <summary>
/// DTO contract for creating a new User.
/// </summary>
public class CreateUserRequest
{
    [Required(ErrorMessage = "User name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "User name must be between 1 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "User role is required.")]
    public UserRole Role { get; set; }

    [StringLength(50, ErrorMessage = "Avatar color / preset cannot exceed 50 characters.")]
    public string? Avatar { get; set; }
}
