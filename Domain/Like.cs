using System;

namespace Domain
{
    public class Like
    {
        public Guid Id { get; set; }
        public User User { get; set; }
        public Activity Activity { get; set; }
        public Comment Comment { get; set; }
        public Reply Reply { get; set; }
    }
}