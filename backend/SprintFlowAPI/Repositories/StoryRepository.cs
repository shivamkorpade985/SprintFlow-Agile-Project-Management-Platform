using Microsoft.EntityFrameworkCore;
using SprintFlowAPI.Data;
using SprintFlowAPI.Models;

namespace SprintFlowAPI.Repositories;

/// <summary>
/// PostgreSQL implementation of IStoryRepository backed by SprintFlowDbContext.
/// Contains DATA ACCESS ONLY — no business rules.
/// </summary>
public class StoryRepository : IStoryRepository
{
    private readonly SprintFlowDbContext _context;

    public StoryRepository(SprintFlowDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<Story>> GetStoriesByProjectAsync(long projectId, CancellationToken cancellationToken = default)
    {
        return await _context.Stories
            .AsNoTracking()
            .Where(s => s.ProjectId == projectId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<Story?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _context.Stories
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<Story> CreateAsync(Story story, CancellationToken cancellationToken = default)
    {
        if (story == null) throw new ArgumentNullException(nameof(story));

        story.CreatedAt = DateTime.UtcNow;
        story.UpdatedAt = null;

        await _context.Stories.AddAsync(story, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return story;
    }

    /// <inheritdoc/>
    public async Task<Story?> UpdateAsync(long id, Story updatedStory, CancellationToken cancellationToken = default)
    {
        var existingStory = await _context.Stories
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (existingStory == null)
        {
            return null;
        }

        existingStory.Title = updatedStory.Title;
        existingStory.Description = updatedStory.Description;
        existingStory.Priority = updatedStory.Priority;
        existingStory.StoryPoints = updatedStory.StoryPoints;
        existingStory.AssignedUserId = updatedStory.AssignedUserId;
        existingStory.Status = updatedStory.Status;
        existingStory.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return existingStory;
    }

    /// <inheritdoc/>
    public async Task<bool> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        var existingStory = await _context.Stories
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

        if (existingStory == null)
        {
            return false;
        }

        _context.Stories.Remove(existingStory);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    /// <inheritdoc/>
    public async Task<bool> ExistsAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _context.Stories
            .AnyAsync(s => s.Id == id, cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<bool> ProjectExistsAsync(long projectId, CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .AnyAsync(p => p.Id == projectId, cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<bool> UserExistsAsync(long userId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AnyAsync(u => u.Id == userId, cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<bool> IsUserMemberOfProjectAsync(long userId, long projectId, CancellationToken cancellationToken = default)
    {
        return await _context.ProjectMembers
            .AnyAsync(pm => pm.UserId == userId && pm.ProjectId == projectId, cancellationToken);
    }
}
