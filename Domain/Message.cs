using System;

namespace Domain
{
    public class Message
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Body { get; set; }
        public User Author { get; set; }
        public Conversation Conversation { get; set; }
    }
}