using System;
using System.Collections.Generic;

namespace Domain
{
    public class HiddenActivity
    {
        public String UserId { get; set; }
        public ICollection<Activity> Activities { get; set; }
    }
}