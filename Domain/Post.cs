using System;

namespace Domain
{
    public class Post
    {
        public Guid Id { get; set; }
        public User User { get; set; }
        public string Content { get; set; }
        public Photo Photo { get; set; }
        public DateTime CreateAt { get; set; }
        
    }
}