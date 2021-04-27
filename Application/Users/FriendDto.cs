using System;
using Application.Activities;
using Domain;

namespace Application.Users
{
    public class FriendDto
    {
        public Guid Id { get; set; }
        public UserDto Friend { get; set; }
        public DateTime? RequestTime { get; set; }

        public FriendRequestFlag FriendRequestFlag { get; set; }

        public ConversationDto Conversation { get; set; }

    }
}