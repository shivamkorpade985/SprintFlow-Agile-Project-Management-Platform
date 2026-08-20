using SprintFlowAPI.DTOs.Stories;

namespace SprintFlowAPI.Services;

/// <summary>
/// Service interface defining the Story business operations.
/// The service layer owns all domain validation and cross-entity business rules.
/// Controllers depend on this interface, never on IStoryRepository directly.
/// </summary>
public interface IStoryService
{
    /// <summary>
    /// Returns all stories for the given project, ordered by creation date descending.
    /// Throws <see cref="KeyNotFoundException"/> if the project does not exist.
    /// </summary>
    Task<IEnumerable<StoryResponse>> GetStoriesByProjectAsync(long projectId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a single story by ID, or null if not found.
    /// </summary>
    Task<StoryResponse?> GetByIdAsync(long id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new story in the specified project.
    /// </summary>
    /// <exception cref="KeyNotFoundException">Thrown when the project does not exist.</exception>
    /// <exception cref="InvalidOperationException">Thrown when the assignee does not exist or is not a project member.</exception>
    Task<StoryResponse> CreateAsync(long projectId, CreateStoryRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing story.
    /// </summary>
    /// <returns>The updated story, or null if the story was not found.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the assignee does not exist or is not a project member.</exception>
    Task<StoryResponse?> UpdateAsync(long id, UpdateStoryRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a story by ID.
    /// </summary>
    /// <returns>True if deleted, false if the story was not found.</returns>
    Task<bool> DeleteAsync(long id, CancellationToken cancellationToken = default);
}
