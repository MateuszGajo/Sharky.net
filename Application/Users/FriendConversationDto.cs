using System;
using Application.Activities;
using Domain;

namespace Application.Users
{
    public class FriendConversationDto
    {
        public Guid Id { get; set; }
        public UserDto Creator { get; set; }
        public UserDto Recipient { get; set; }
        public int MessagesCount { get; set; }
#nullable enable
        public string? MessageTo { get; set; }
    }
}