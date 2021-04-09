using System;

namespace Domain
{
    public class HiddenReply
    {
        public Guid Id { get; set; }
        public User User { get; set; }
        public Reply Reply { get; set; }
    }
}