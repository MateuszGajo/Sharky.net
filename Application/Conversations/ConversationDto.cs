using System;
using Application.Activities;

namespace Application.Conversations
{
    public class ConversationDto
    {
        public Guid Id { get; set; }
        public UserDto User { get; set; }
        public MessageDto LastMessage { get; set; }
        public string MessageTo { get; set; }
        public Guid? FriendId { get; set; }
        public int MessagesCount { get; set; }
    }
}