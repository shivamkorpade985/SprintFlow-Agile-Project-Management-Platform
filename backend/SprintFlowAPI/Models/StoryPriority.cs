namespace SprintFlowAPI.Models;

/// <summary>
/// Priority levels for a User Story, matching the frontend StoryPriority union type.
/// Stored as string in PostgreSQL and serialized as string in JSON.
/// </summary>
public enum StoryPriority
{
    LOW,
    MEDIUM,
    HIGH
}
