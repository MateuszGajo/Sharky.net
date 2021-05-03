using System;
using Application.Activities;

namespace Application.Conversations
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Body { get; set; }
        public UserDto Author { get; set; }
    }
}