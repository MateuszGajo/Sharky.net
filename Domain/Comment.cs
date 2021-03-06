using System;
using System.Collections.Generic;

namespace Domain
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }
        public User Author { get; set; }
        public Activity Activity { get; set; }
        public ICollection<Like> Likes { get; set; } = new List<Like>();
        public int LikesCount { get; set; } = 0;
        public ICollection<Reply> Replies { get; set; } = new List<Reply>();
        public int RepliesCount { get; set; } = 0;
    }
}