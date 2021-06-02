using Domain;

namespace Application.Users
{
    public class UserDetailsDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Photo Photo { get; set; }
        public long FriendsCount { get; set; }
        public long ActivitiesCount { get; set; }
    }
}