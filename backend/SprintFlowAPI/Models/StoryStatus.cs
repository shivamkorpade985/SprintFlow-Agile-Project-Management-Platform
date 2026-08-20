namespace SprintFlowAPI.Models;

/// <summary>
/// Workflow status values for a User Story, matching the frontend StoryStatus union type.
/// Stored as string in PostgreSQL and serialized as string in JSON.
/// </summary>
public enum StoryStatus
{
    BACKLOG,
    IN_PROGRESS,
    TESTING,
    DONE
}
