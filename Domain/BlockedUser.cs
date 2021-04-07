using System;
using System.Collections.Generic;

namespace Domain
{
    public class BlockedUser
    {
        public String UserId { get; set; }
        public ICollection<User> Users { get; set; }
    }
}