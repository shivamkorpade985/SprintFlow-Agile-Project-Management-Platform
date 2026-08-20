namespace SprintFlowAPI.DTOs.Users;

/// <summary>
/// Output DTO returned by User endpoints.
/// Aligned with frontend User: { id: number, name: string, role: string, avatar?: string }
/// </summary>
public class UserResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Avatar { get; set; }
}
