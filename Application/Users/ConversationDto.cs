using System;
using Domain;

namespace Application.Users
{
    public class ConversationDto
    {
        public Guid Id { get; set; }
        public User Creator { get; set; }
        public User Recipient { get; set; }
    }
}