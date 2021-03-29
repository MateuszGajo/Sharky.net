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
        public ICollection<Activity> Activities { get; set; }
    }
}