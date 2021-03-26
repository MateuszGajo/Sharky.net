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
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public ICollection<Post> Posts { get; set; }
    }
}