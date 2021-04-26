using System;

namespace Domain
{
    public class HiddenComment
    {
        public Guid Id { get; set; }
        public User User { get; set; }
        public Comment Comment { get; set; }
    }
}