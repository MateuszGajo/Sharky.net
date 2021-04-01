using System;
using System.Collections.Generic;
using Domain;

namespace Application.Activities
{
    public class CommentDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public UserDto Author { get; set; }
         public int Likes { get; set; } 
          public ICollection<ReplyDto> Replies { get; set; }
    }
}