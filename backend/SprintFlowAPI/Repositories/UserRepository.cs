using Microsoft.EntityFrameworkCore;
using SprintFlowAPI.Data;
using SprintFlowAPI.Models;

namespace SprintFlowAPI.Repositories;

/// <summary>
/// PostgreSQL implementation of IUserRepository backed by SprintFlowDbContext.
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly SprintFlowDbContext _context;

    public UserRepository(SprintFlowDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .OrderBy(u => u.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<User?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public async Task<User> CreateAsync(User user, CancellationToken cancellationToken = default)
    {
        if (user == null) throw new ArgumentNullException(nameof(user));

        await _context.Users.AddAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return user;
    }

    public async Task<User?> UpdateAsync(long id, string name, string role, string? avatar, CancellationToken cancellationToken = default)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

        if (existingUser == null)
        {
            return null;
        }

        existingUser.Name = name;
        existingUser.Role = role;
        existingUser.Avatar = avatar;

        await _context.SaveChangesAsync(cancellationToken);

        return existingUser;
    }

    public async Task<bool> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

        if (existingUser == null)
        {
            return false;
        }

        _context.Users.Remove(existingUser);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<bool> ExistsAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AnyAsync(u => u.Id == id, cancellationToken);
    }
}
