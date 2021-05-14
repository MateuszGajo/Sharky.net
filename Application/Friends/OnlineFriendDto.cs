using System;
using Application.Activities;
using Domain;

namespace Application.Friends
{
    public class OnlineFriendDto
    {
        public Guid Id { get; set; }
        public UserDto Friend { get; set; }
        public DateTime? RequestTime { get; set; }

        public FriendRequestFlag FriendRequestFlag { get; set; }

        public FriendConversationDto Conversation { get; set; }

    }
}