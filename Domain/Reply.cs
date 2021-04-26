using System;
using System.Collections.Generic;

namespace Domain
{
    public class Reply
    {
        public Guid Id { get; set; }
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        public Comment Comment { get; set; }
        public User Author { get; set; }
        public ICollection<Like> Likes { get; set; } = new List<Like>();
        public int LikesCount { get; set; }
    }
}