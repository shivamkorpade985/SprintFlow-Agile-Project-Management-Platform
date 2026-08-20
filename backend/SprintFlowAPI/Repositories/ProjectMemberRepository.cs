using Microsoft.EntityFrameworkCore;
using SprintFlowAPI.Data;
using SprintFlowAPI.Models;

namespace SprintFlowAPI.Repositories;

/// <summary>
/// PostgreSQL implementation of IProjectMemberRepository backed by SprintFlowDbContext.
/// </summary>
public class ProjectMemberRepository : IProjectMemberRepository
{
    private readonly SprintFlowDbContext _context;

    public ProjectMemberRepository(SprintFlowDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<IEnumerable<ProjectMember>> GetMembersByProjectIdAsync(long projectId, CancellationToken cancellationToken = default)
    {
        return await _context.ProjectMembers
            .AsNoTracking()
            .Include(pm => pm.User)
            .Where(pm => pm.ProjectId == projectId)
            .OrderBy(pm => pm.User.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<ProjectMember?> GetMembershipAsync(long projectId, long userId, CancellationToken cancellationToken = default)
    {
        return await _context.ProjectMembers
            .AsNoTracking()
            .Include(pm => pm.User)
            .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == userId, cancellationToken);
    }

    public async Task<bool> IsMemberAsync(long projectId, long userId, CancellationToken cancellationToken = default)
    {
        return await _context.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == userId, cancellationToken);
    }

    public async Task<ProjectMember> AddMemberAsync(ProjectMember member, CancellationToken cancellationToken = default)
    {
        if (member == null) throw new ArgumentNullException(nameof(member));

        await _context.ProjectMembers.AddAsync(member, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        // Load the user navigation property if not already loaded
        await _context.Entry(member).Reference(pm => pm.User).LoadAsync(cancellationToken);

        return member;
    }

    public async Task<bool> RemoveMemberAsync(long projectId, long userId, CancellationToken cancellationToken = default)
    {
        var existingMembership = await _context.ProjectMembers
            .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == userId, cancellationToken);

        if (existingMembership == null)
        {
            return false;
        }

        _context.ProjectMembers.Remove(existingMembership);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<bool> ProjectExistsAsync(long projectId, CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .AnyAsync(p => p.Id == projectId, cancellationToken);
    }

    public async Task<bool> UserExistsAsync(long userId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AnyAsync(u => u.Id == userId, cancellationToken);
    }
}
