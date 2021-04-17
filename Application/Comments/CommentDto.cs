using System;
using Application.Activities;
using Domain;

namespace Application.Comments
{
    public class CommentDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserDto Author { get; set; }
        public int Likes { get; set; }

        public bool isHidden { get; set; }
        public int RepliesCount { get; set; }
    }
}