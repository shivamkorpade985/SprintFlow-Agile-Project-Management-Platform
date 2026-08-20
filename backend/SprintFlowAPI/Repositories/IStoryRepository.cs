using SprintFlowAPI.Models;

namespace SprintFlowAPI.Repositories;

/// <summary>
/// Repository interface defining data access operations for Story entities.
/// This interface is DATABASE ACCESS ONLY — no business rules live here.
/// Business rules (project exists, assignee is a project member, etc.) belong in StoryService.
/// </summary>
public interface IStoryRepository
{
    /// <summary>
    /// Returns all stories belonging to a project, ordered by creation date descending.
    /// </summary>
    Task<IEnumerable<Story>> GetStoriesByProjectAsync(long projectId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a single story by its ID, or null if not found.
    /// </summary>
    Task<Story?> GetByIdAsync(long id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Persists a new story and returns the created entity with its generated ID.
    /// </summary>
    Task<Story> CreateAsync(Story story, CancellationToken cancellationToken = default);

    /// <summary>
    /// Persists changes to an existing story and returns the updated entity.
    /// Returns null if the story does not exist.
    /// </summary>
    Task<Story?> UpdateAsync(long id, Story updatedStory, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a story by ID. Returns true if deleted, false if not found.
    /// </summary>
    Task<bool> DeleteAsync(long id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns true if a story with the given ID exists.
    /// </summary>
    Task<bool> ExistsAsync(long id, CancellationToken cancellationToken = default);

    // ============================================================================
    // Support queries used by StoryService to enforce business rules.
    // These provide raw data access — the service interprets and applies the rules.
    // ============================================================================

    /// <summary>
    /// Returns true if a project with the given ID exists.
    /// Used by StoryService to validate the project before creating/fetching stories.
    /// </summary>
    Task<bool> ProjectExistsAsync(long projectId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns true if a user with the given ID exists.
    /// Used by StoryService to validate the assignee before checking membership.
    /// </summary>
    Task<bool> UserExistsAsync(long userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns true if the given user is a member of the given project.
    /// Used by StoryService to enforce the cross-entity business rule:
    /// "The assigned user must be a member of the story's project."
    /// </summary>
    Task<bool> IsUserMemberOfProjectAsync(long userId, long projectId, CancellationToken cancellationToken = default);
}
