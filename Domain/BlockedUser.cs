using System;

namespace Domain
{
    public class BlockedUser
    {
        public Guid Id { get; set; }
        public User User { get; set; }
        public User Blocked { get; set; }
    }
}