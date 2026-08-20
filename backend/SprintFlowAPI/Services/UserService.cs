using SprintFlowAPI.DTOs.Users;
using SprintFlowAPI.Models;
using SprintFlowAPI.Repositories;

namespace SprintFlowAPI.Services;

/// <summary>
/// Application service implementing User business logic and domain mapping.
/// Orchestrates IUserRepository and handles business rules.
/// </summary>
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<UserService> _logger;

    public UserService(IUserRepository userRepository, ILogger<UserService> logger)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IEnumerable<UserResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var users = await _userRepository.GetAllAsync(cancellationToken);
        return users.Select(MapToResponse);
    }

    public async Task<UserResponse?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(id, cancellationToken);
        return user is null ? null : MapToResponse(user);
    }

    public async Task<UserResponse> CreateAsync(CreateUserRequest request, CancellationToken cancellationToken = default)
    {
        var user = new User
        {
            Name = request.Name.Trim(),
            Role = request.Role.ToString(),
            Avatar = string.IsNullOrWhiteSpace(request.Avatar) ? null : request.Avatar.Trim()
        };

        var createdUser = await _userRepository.CreateAsync(user, cancellationToken);
        _logger.LogInformation("User {UserId} ('{UserName}') created with role {Role}.", createdUser.Id, createdUser.Name, createdUser.Role);

        return MapToResponse(createdUser);
    }

    public async Task<UserResponse?> UpdateAsync(long id, UpdateUserRequest request, CancellationToken cancellationToken = default)
    {
        var updatedUser = await _userRepository.UpdateAsync(
            id,
            request.Name.Trim(),
            request.Role.ToString(),
            string.IsNullOrWhiteSpace(request.Avatar) ? null : request.Avatar.Trim(),
            cancellationToken);

        if (updatedUser is not null)
        {
            _logger.LogInformation("User {UserId} updated.", id);
        }

        return updatedUser is null ? null : MapToResponse(updatedUser);
    }

    public async Task<bool> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        var deleted = await _userRepository.DeleteAsync(id, cancellationToken);

        if (deleted)
        {
            _logger.LogInformation("User {UserId} deleted.", id);
        }

        return deleted;
    }

    private static UserResponse MapToResponse(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Role = user.Role,
            Avatar = user.Avatar
        };
    }
}
