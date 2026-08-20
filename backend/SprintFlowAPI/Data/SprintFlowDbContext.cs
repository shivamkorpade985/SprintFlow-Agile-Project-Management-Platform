using Microsoft.EntityFrameworkCore;
using SprintFlowAPI.Models;

namespace SprintFlowAPI.Data;

/// <summary>
/// Entity Framework Core Database Context for SprintFlow.
/// Uses Scoped lifetime per HTTP request.
/// </summary>
public class SprintFlowDbContext : DbContext
{
    public SprintFlowDbContext(DbContextOptions<SprintFlowDbContext> options)
        : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<User> Users => Set<User>();
    public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();
    public DbSet<Story> Stories => Set<Story>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ============================================================================
        // Project entity configuration
        // ============================================================================
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Id)
                .ValueGeneratedOnAdd();

            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(p => p.Description)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(p => p.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(p => p.UpdatedAt)
                .IsRequired(false);
        });

        // ============================================================================
        // User entity configuration
        // ============================================================================
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);

            entity.Property(u => u.Id)
                .ValueGeneratedOnAdd();

            entity.Property(u => u.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(u => u.Role)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(u => u.Avatar)
                .IsRequired(false)
                .HasMaxLength(50);
        });

        // ============================================================================
        // ProjectMember entity configuration
        // ============================================================================
        modelBuilder.Entity<ProjectMember>(entity =>
        {
            entity.HasKey(pm => pm.Id);

            entity.Property(pm => pm.Id)
                .ValueGeneratedOnAdd();

            // Add a unique index to prevent duplicate memberships
            entity.HasIndex(pm => new { pm.ProjectId, pm.UserId })
                .IsUnique();

            // ProjectMember → Project: cascade delete (removing project removes memberships)
            entity.HasOne(pm => pm.Project)
                .WithMany(p => p.Members)
                .HasForeignKey(pm => pm.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // ProjectMember → User: cascade delete (removing user removes their memberships)
            entity.HasOne(pm => pm.User)
                .WithMany(u => u.ProjectMemberships)
                .HasForeignKey(pm => pm.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ============================================================================
        // Story entity configuration
        // ============================================================================
        modelBuilder.Entity<Story>(entity =>
        {
            entity.HasKey(s => s.Id);

            entity.Property(s => s.Id)
                .ValueGeneratedOnAdd();

            entity.Property(s => s.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(s => s.Description)
                .IsRequired()
                .HasMaxLength(2000);

            // Store StoryPriority enum as a string column in PostgreSQL.
            // Rationale: the frontend expects "LOW"/"MEDIUM"/"HIGH" string literals in JSON.
            // Storing as string keeps the DB human-readable and avoids EF Core / Npgsql
            // native enum type registration complexity.
            entity.Property(s => s.Priority)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.Property(s => s.StoryPoints)
                .IsRequired();

            // Store StoryStatus enum as a string column in PostgreSQL.
            // Same rationale as Priority — frontend expects "BACKLOG"/"IN_PROGRESS"/etc.
            entity.Property(s => s.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.Property(s => s.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(s => s.UpdatedAt)
                .IsRequired(false);

            // Story → Project: cascade delete.
            // Rationale: a story cannot exist independently of a project.
            // Deleting a project removes all its stories.
            entity.HasOne(s => s.Project)
                .WithMany(p => p.Stories)
                .HasForeignKey(s => s.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // Story → User (AssignedUserId): set null on delete.
            // Rationale: a story belongs to a project, not a user.
            // Deleting a user should clear the assignment, not delete the story.
            entity.HasOne(s => s.AssignedUser)
                .WithMany(u => u.AssignedStories)
                .HasForeignKey(s => s.AssignedUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
