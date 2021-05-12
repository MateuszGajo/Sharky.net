using System;

namespace Domain
{
    public class UserFriendship
    {
        public Guid Id { get; set; }
        public string RequestedById { get; set; }
        public User RequestedBy { get; set; }
        public string RequestedToId { get; set; }
        public User RequestedTo { get; set; }
        public DateTime? RequestTime { get; set; }

        public FriendRequestFlag FriendRequestFlag { get; set; }
#nullable enable
        public Guid ConversationId { get; set; }
        public Conversation? Conversation { get; set; }
        public Guid? MessageToUser { get; set; }
    }

    public enum FriendRequestFlag
    {
        None,
        Approved,
        Rejected
    }
}