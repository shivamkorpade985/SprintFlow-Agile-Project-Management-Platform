using SprintFlowAPI.DTOs.Stories;
using SprintFlowAPI.Models;
using SprintFlowAPI.Repositories;

namespace SprintFlowAPI.Services;

/// <summary>
/// Concrete implementation of IStoryService.
/// This class owns ALL Story business rules and domain validation.
/// It orchestrates IStoryRepository calls and applies cross-entity rules.
/// </summary>
public class StoryService : IStoryService
{
    private readonly IStoryRepository _storyRepository;
    private readonly ILogger<StoryService> _logger;

    public StoryService(IStoryRepository storyRepository, ILogger<StoryService> logger)
    {
        _storyRepository = storyRepository ?? throw new ArgumentNullException(nameof(storyRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<StoryResponse>> GetStoriesByProjectAsync(long projectId, CancellationToken cancellationToken = default)
    {
        // Business rule: the project must exist before we can return its stories.
        var projectExists = await _storyRepository.ProjectExistsAsync(projectId, cancellationToken);
        if (!projectExists)
        {
            throw new KeyNotFoundException($"Project with ID '{projectId}' was not found.");
        }

        var stories = await _storyRepository.GetStoriesByProjectAsync(projectId, cancellationToken);
        return stories.Select(MapToResponse);
    }

    /// <inheritdoc/>
    public async Task<StoryResponse?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        var story = await _storyRepository.GetByIdAsync(id, cancellationToken);
        return story is null ? null : MapToResponse(story);
    }

    /// <inheritdoc/>
    public async Task<StoryResponse> CreateAsync(long projectId, CreateStoryRequest request, CancellationToken cancellationToken = default)
    {
        // ── Business Rule 1: Project must exist ──────────────────────────────────
        var projectExists = await _storyRepository.ProjectExistsAsync(projectId, cancellationToken);
        if (!projectExists)
        {
            throw new KeyNotFoundException($"Project with ID '{projectId}' was not found.");
        }

        // ── Business Rule 2: Assignee validation (if provided) ──────────────────
        if (request.AssignedUserId.HasValue)
        {
            await ValidateAssigneeForProjectAsync(request.AssignedUserId.Value, projectId, cancellationToken);
        }

        // ── Create and persist ───────────────────────────────────────────────────
        var story = new Story
        {
            ProjectId = projectId,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Priority = request.Priority,
            StoryPoints = request.StoryPoints,
            AssignedUserId = request.AssignedUserId,
            Status = request.Status
        };

        var createdStory = await _storyRepository.CreateAsync(story, cancellationToken);

        _logger.LogInformation(
            "Story {StoryId} created in Project {ProjectId}.",
            createdStory.Id, projectId);

        return MapToResponse(createdStory);
    }

    /// <inheritdoc/>
    public async Task<StoryResponse?> UpdateAsync(long id, UpdateStoryRequest request, CancellationToken cancellationToken = default)
    {
        // ── Business Rule 1: Story must exist ────────────────────────────────────
        var existingStory = await _storyRepository.GetByIdAsync(id, cancellationToken);
        if (existingStory is null)
        {
            return null;
        }

        // ── Business Rule 2: Assignee validation (if provided or changed) ────────
        // We always re-validate the assignee on update to guard against
        // a scenario where the user was removed from the project after the story was created.
        if (request.AssignedUserId.HasValue)
        {
            await ValidateAssigneeForProjectAsync(request.AssignedUserId.Value, existingStory.ProjectId, cancellationToken);
        }

        // ── Apply changes ────────────────────────────────────────────────────────
        var updatedStory = new Story
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Priority = request.Priority,
            StoryPoints = request.StoryPoints,
            AssignedUserId = request.AssignedUserId,
            Status = request.Status
        };

        var result = await _storyRepository.UpdateAsync(id, updatedStory, cancellationToken);

        if (result is not null)
        {
            _logger.LogInformation("Story {StoryId} updated.", id);
        }

        return result is null ? null : MapToResponse(result);
    }

    /// <inheritdoc/>
    public async Task<bool> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        var deleted = await _storyRepository.DeleteAsync(id, cancellationToken);

        if (deleted)
        {
            _logger.LogInformation("Story {StoryId} deleted.", id);
        }

        return deleted;
    }

    // ============================================================================
    // Private helpers
    // ============================================================================

    /// <summary>
    /// Validates that the given user exists and is a member of the given project.
    /// Throws <see cref="InvalidOperationException"/> with a descriptive message on failure.
    /// This is a BUSINESS RULE — the service enforces it, the repository only provides data.
    /// </summary>
    private async Task ValidateAssigneeForProjectAsync(long userId, long projectId, CancellationToken cancellationToken)
    {
        var userExists = await _storyRepository.UserExistsAsync(userId, cancellationToken);
        if (!userExists)
        {
            throw new InvalidOperationException($"User with ID '{userId}' was not found.");
        }

        var isMember = await _storyRepository.IsUserMemberOfProjectAsync(userId, projectId, cancellationToken);
        if (!isMember)
        {
            throw new InvalidOperationException(
                $"User with ID '{userId}' is not a member of project '{projectId}'. " +
                "Only project team members can be assigned to stories.");
        }
    }

    /// <summary>
    /// Maps a Story entity to a StoryResponse DTO.
    /// Priority and Status enum names are converted to their string representations
    /// to match the frontend's expected literal values ("BACKLOG", "HIGH", etc.).
    /// </summary>
    private static StoryResponse MapToResponse(Story story)
    {
        return new StoryResponse
        {
            Id = story.Id,
            ProjectId = story.ProjectId,
            Title = story.Title,
            Description = story.Description,
            Priority = story.Priority.ToString(),
            StoryPoints = story.StoryPoints,
            AssignedUserId = story.AssignedUserId,
            Status = story.Status.ToString(),
            CreatedAt = story.CreatedAt
        };
    }
}
