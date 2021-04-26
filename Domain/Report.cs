using System;
using System.Collections.Generic;

namespace Domain
{
    public class Reason
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
    public class Report
    {
        public Guid Id { get; set; }
        public User User { get; set; }
        public User ReportedUser { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<Reason> Reasons { get; set; }
    }
}