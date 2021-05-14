using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class User : IdentityUser
    {
        public string TwitterId { get; set; }
        public string FacebookId { get; set; }
        public string GoogleId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public bool IsActive { get; set; } = false;

        public int MessagesCount { get; set; } = 0;
        public int FriendRequestCount { get; set; } = 0;
        public int NotificationsCount { get; set; } = 0;

        public ICollection<UserFriendship> Friends { get; set; } = new List<UserFriendship>();
        public ICollection<UserFriendship> FriendsOf { get; set; } = new List<UserFriendship>();
        public ICollection<Activity> Activities { get; set; }
        public ICollection<HiddenActivity> HiddenActivities { get; set; } = new List<HiddenActivity>();
        public ICollection<HiddenComment> HiddenComments { get; set; } = new List<HiddenComment>();
        public ICollection<HiddenReply> HiddenReplies { get; set; } = new List<HiddenReply>();
        public ICollection<BlockedUser> BlockedUsers { get; set; } = new List<BlockedUser>();
    }
}