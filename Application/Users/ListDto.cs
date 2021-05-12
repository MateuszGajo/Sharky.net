using Domain;

namespace Application.Users
{
    public class ListDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        // public Photo photo { get; set; }
        public bool isFriend { get; set; }
    }
}