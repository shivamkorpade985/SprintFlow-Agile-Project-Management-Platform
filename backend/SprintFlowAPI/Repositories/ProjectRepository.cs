using Microsoft.EntityFrameworkCore;
using SprintFlowAPI.Data;
using SprintFlowAPI.Models;

namespace SprintFlowAPI.Repositories;

/// <summary>
/// PostgreSQL implementation of IProjectRepository backed by SprintFlowDbContext.
/// </summary>
public class ProjectRepository : IProjectRepository
{
    private readonly SprintFlowDbContext _context;

    public ProjectRepository(SprintFlowDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<IEnumerable<Project>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .AsNoTracking()
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Project?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<Project> CreateAsync(Project project, CancellationToken cancellationToken = default)
    {
        if (project == null) throw new ArgumentNullException(nameof(project));

        project.CreatedAt = DateTime.UtcNow;
        project.UpdatedAt = null;

        await _context.Projects.AddAsync(project, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return project;
    }

    public async Task<Project?> UpdateAsync(long id, string name, string description, CancellationToken cancellationToken = default)
    {
        var existingProject = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (existingProject == null)
        {
            return null;
        }

        existingProject.Name = name;
        existingProject.Description = description;
        existingProject.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return existingProject;
    }

    public async Task<bool> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        var existingProject = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (existingProject == null)
        {
            return false;
        }

        _context.Projects.Remove(existingProject);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> ExistsAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .AnyAsync(p => p.Id == id, cancellationToken);
    }
}
