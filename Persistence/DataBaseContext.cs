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
        public DbSet<UserFriendship> UserFriendships { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<UserFriendship>(b =>
            {
                b.HasKey(x => new { x.RequestedById, x.RequestedToId, x.ConversationId });

                b.HasOne(x => x.RequestedBy)
                .WithMany(x => x.Friends)
                .HasForeignKey(x => x.RequestedById)
                .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(x => x.RequestedTo)
                .WithMany(x => x.FriendsOf)
                .HasForeignKey(x => x.RequestedToId)
                .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(x => x.Conversation)
                .WithOne(x => x.Friendship)
                .HasForeignKey<UserFriendship>(x => x.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Message>()
                .HasOne(c => c.Conversation)
                .WithMany(m => m.Messages)
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