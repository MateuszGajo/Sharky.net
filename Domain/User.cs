using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class User : IdentityUser
    {
        //  public Guid Id { get; set; }
        //  public string Email { get; set; }
        //  public string Password { get; set; }
        //  public string PasswordHash { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public ICollection<Post> Posts { get; set; }
    }
}