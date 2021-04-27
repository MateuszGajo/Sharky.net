using System;

namespace Domain
{
    public class Friend
    {
        public Guid Id { get; set; }
        public User RequestedBy { get; set; }
        public User RequestedTo { get; set; }
        public DateTime? RequestTime { get; set; }

        public FriendRequestFlag FriendRequestFlag { get; set; }
        public Conversation? conversation { get; set; }
    }

    public enum FriendRequestFlag
    {
        None,
        Approved,
        Rejected
    }
}