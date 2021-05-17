using System;
using Application.Activities;

namespace Application.Settings
{
    public class BlockUserDto
    {
        public Guid Id { get; set; }
        public UserDto User { get; set; }
    }
}