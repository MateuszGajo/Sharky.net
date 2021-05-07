using System;
using System.Collections.Generic;

namespace Domain
{
    public class Conversation
    {
        public Guid Id { get; set; }
        public User Creator { get; set; }
        public User Recipient { get; set; }
        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public int MessagesCount { get; set; } = 0;
#nullable enable
        public Message? LastMessage { get; set; }

        public string? MessageTo { get; set; }
        public Guid? FriendId { get; set; }
    }
}