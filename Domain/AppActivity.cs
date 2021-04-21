using System;

namespace Domain
{
    public class AppActivity
    {
        public Guid Id { get; set; }
        public Activity Activity { get; set; }
        public User SharingUser { get; set; }
        public Guid AppActivityId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}