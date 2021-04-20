using System;
using Domain;

namespace Application.Activities
{
    public class ShareDto
    {
        public UserDto User { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}