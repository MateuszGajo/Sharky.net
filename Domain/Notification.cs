using System;

namespace Domain
{
    public class Notification
    {
        public Guid Id { get; set; }
        public User User { get; set; }
        public string Type { get; set; }
        public Guid RefId { get; set; }
    }
}