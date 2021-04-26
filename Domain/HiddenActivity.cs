using System;
using System.Collections.Generic;

namespace Domain
{
    public class HiddenActivity
    {
        public Guid Id { get; set; }
        public User User { get; set; }

        public Activity Activity { get; set; }
    }
}