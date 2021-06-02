using System;
using Domain;

namespace Application.Activities
{
    public class UserDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Photo photo { get; set; }
    }
}