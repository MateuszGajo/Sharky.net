using System;
using Domain;

namespace Application.Activities
{
    public class ShareDto
    {
        public Guid AppActivityId { get; set; }
        public UserDto User { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}