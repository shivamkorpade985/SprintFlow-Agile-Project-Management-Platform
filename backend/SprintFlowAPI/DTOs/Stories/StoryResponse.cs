namespace SprintFlowAPI.DTOs.Stories;

/// <summary>
/// Output DTO for Story queries.
/// Matches the frontend UserStory interface:
/// { id, projectId, title, description, priority, storyPoints, assignedUserId, status, createdAt }
/// All IDs are numeric (long) matching TypeScript number type.
/// Priority and Status are serialized as strings by JsonStringEnumConverter.
/// </summary>
public class StoryResponse
{
    public long Id { get; set; }

    public long ProjectId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Serialized as "LOW", "MEDIUM", or "HIGH" by JsonStringEnumConverter.
    /// </summary>
    public string Priority { get; set; } = string.Empty;

    public int StoryPoints { get; set; }

    /// <summary>
    /// Null when the story is unassigned. Matches frontend assignedUserId?: number | null.
    /// </summary>
    public long? AssignedUserId { get; set; }

    /// <summary>
    /// Serialized as "BACKLOG", "IN_PROGRESS", "TESTING", or "DONE".
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// ISO 8601 timestamp. Matches frontend createdAt: string.
    /// </summary>
    public DateTime CreatedAt { get; set; }
}
