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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Activity>()
                .HasOne(p => p.User)
                .WithMany(b => b.Activities);
        
            modelBuilder.Entity<Comment>()
                .HasOne(p => p.Activity)
                .WithMany(b => b.Comments);

            modelBuilder.Entity<Reply>()
                .HasOne(p => p.Comment)
                .WithMany(b => b.Replies);

        }

    }
}