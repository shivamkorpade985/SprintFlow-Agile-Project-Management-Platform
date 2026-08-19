using Microsoft.AspNetCore.Mvc;
using SprintFlowAPI.DTOs.Projects;
using SprintFlowAPI.Models;
using SprintFlowAPI.Repositories;

namespace SprintFlowAPI.Controllers;

[ApiController]
[Route("api/projects")]
[Produces("application/json")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectRepository _projectRepository;
    private readonly ILogger<ProjectsController> _logger;

    public ProjectsController(IProjectRepository projectRepository, ILogger<ProjectsController> logger)
    {
        _projectRepository = projectRepository ?? throw new ArgumentNullException(nameof(projectRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Gets all projects ordered by creation date descending.
    /// </summary>
    /// <returns>List of project summaries.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProjectResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProjectResponse>>> GetAllProjects(CancellationToken cancellationToken)
    {
        var projects = await _projectRepository.GetAllAsync(cancellationToken);

        var response = projects.Select(MapToResponse);
        return Ok(response);
    }

    /// <summary>
    /// Gets a specific project by its numeric identifier.
    /// </summary>
    /// <param name="id">Project numeric ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Project details if found, otherwise 404.</returns>
    [HttpGet("{id:long}")]
    [ProducesResponseType(typeof(ProjectResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProjectResponse>> GetProjectById(long id, CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(id, cancellationToken);

        if (project == null)
        {
            return NotFound(new { message = $"Project with ID '{id}' was not found." });
        }

        return Ok(MapToResponse(project));
    }

    /// <summary>
    /// Creates a new project with auto-generated numeric ID.
    /// </summary>
    /// <param name="request">Project creation payload</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created project details and Location header.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(ProjectResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProjectResponse>> CreateProject([FromBody] CreateProjectRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var project = new Project
        {
            Name = request.Name.Trim(),
            Description = request.Description.Trim()
        };

        var createdProject = await _projectRepository.CreateAsync(project, cancellationToken);
        var response = MapToResponse(createdProject);

        return CreatedAtAction(
            nameof(GetProjectById),
            new { id = response.Id },
            response
        );
    }

    /// <summary>
    /// Updates an existing project.
    /// </summary>
    /// <param name="id">Project numeric ID</param>
    /// <param name="request">Updated project payload</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>204 No Content if updated, 404 if not found.</returns>
    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProject(long id, [FromBody] UpdateProjectRequest request, CancellationToken cancellationToken)
    {
        var updatedProject = await _projectRepository.UpdateAsync(
            id,
            request.Name.Trim(),
            request.Description.Trim(),
            cancellationToken
        );

        if (updatedProject == null)
        {
            return NotFound(new { message = $"Project with ID '{id}' was not found." });
        }

        return NoContent();
    }

    /// <summary>
    /// Deletes a project.
    /// </summary>
    /// <param name="id">Project numeric ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>204 No Content if deleted, 404 if not found.</returns>
    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProject(long id, CancellationToken cancellationToken)
    {
        var deleted = await _projectRepository.DeleteAsync(id, cancellationToken);

        if (!deleted)
        {
            return NotFound(new { message = $"Project with ID '{id}' was not found." });
        }

        return NoContent();
    }

    private static ProjectResponse MapToResponse(Project project)
    {
        return new ProjectResponse
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt
        };
    }
}
