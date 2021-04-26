using System;
using System.Collections.Generic;

namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
        public User User { get; set; }
        public string Content { get; set; }
        public Photo Photo { get; set; }
        public DateTime CreatedAt { get; set; }
        public int LikesCount { get; set; } = 0;
        public int CommentsCount { get; set; } = 0;
        public int SharesCount { get; set; } = 0;
        public ICollection<Like> Likes { get; set; } = new List<Like>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<AppActivity> AppActivities { get; set; } = new List<AppActivity>();
    }
}