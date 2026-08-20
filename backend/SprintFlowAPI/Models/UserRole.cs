namespace SprintFlowAPI.Models;

/// <summary>
/// Defines user roles within the SprintFlow platform.
/// Serialized as string literals ("DEVELOPER", "TESTER", "MANAGER")
/// matching the frontend UserRole union type.
/// </summary>
public enum UserRole
{
    DEVELOPER,
    TESTER,
    MANAGER
}
