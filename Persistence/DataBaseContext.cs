using System;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataBaseContext : DbContext
    {
        public DataBaseContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Reply> Replies { get; set; }
        public DbSet<HiddenActivity> HiddenActivites { get; set; }
        public DbSet<HiddenComment> HiddenComments { get; set; }
        public DbSet<HiddenReply> HiddenReplies { get; set; }
        public DbSet<BlockedUser> BlockedUsers { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<AppActivity> AppActivity { get; set; }
        public DbSet<Report> Reports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Activity>()
            .HasMany(a => a.AppActivities)
            .WithOne(a => a.Activity)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Like>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.Likes)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Like>()
                .HasOne(u => u.Comment)
                .WithMany(a => a.Likes)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Like>()
                .HasOne(u => u.Reply)
                .WithMany(a => a.Likes)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HiddenActivity>()
                .HasOne(p => p.User)
                .WithMany(b => b.HiddenActivities)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HiddenComment>()
                .HasOne(u => u.User)
                .WithMany(h => h.HiddenComments)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HiddenReply>()
                .HasOne(u => u.User)
                .WithMany(h => h.HiddenReplies)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BlockedUser>()
                .HasOne(u => u.User)
                .WithMany(b => b.BlockedUsers);

            modelBuilder.Entity<Activity>()
                .HasOne(p => p.User)
                .WithMany(b => b.Activities)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasOne(p => p.Activity)
                .WithMany(b => b.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Reply>()
                .HasOne(p => p.Comment)
                .WithMany(b => b.Replies)
                .OnDelete(DeleteBehavior.Cascade);

        }

    }
}