using System;
using System.Collections.Generic;
using Domain;

namespace Application.Activities
{
    public class ActivityDto
    {
        public Guid Id { get; set; }
        public Guid ActivityId { get; set; }
        public UserDto User { get; set; }
        public string Content { get; set; }
        public Photo Photo { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public int Likes { get; set; }
        public bool IsLiked { get; set; }
        public int CommentsCount { get; set; }
        public int SharesCount { get; set; }
        public ShareDto Share { get; set; }
    }
}