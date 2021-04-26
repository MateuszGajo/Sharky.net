using System;
using Application.Activities;

namespace Application.Replies
{
    public class ReplyDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserDto Author { get; set; }
        public int Likes { get; set; }
        public bool isHidden { get; set; }
        public bool isLiked { get; set; }
    }
}