using System;
using Application.Activities;

namespace Application.Friends
{
    public class FriendDto
    {
        public Guid Id { get; set; }
        public UserDto User { get; set; }
    }
}