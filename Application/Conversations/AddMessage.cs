using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Conversations
{


    public class AddMessage
    {

        public class Response
        {
            public DateTime CreatedAt { get; set; }
            public Guid Id { get; set; }
        }
        public class Command : IRequest<Response>
        {
            public Guid ConversationId { get; set; }
            public string Message { get; set; }
        }

        public class Handler : IRequestHandler<Command, Response>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataBaseContext _context;
            public Handler(DataBaseContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public Guid Id { get; set; }
            public DateTime CreatedAt { get; set; }
            public string Body { get; set; }
            public User Author { get; set; }
            public Conversation Conversation { get; set; }

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                Conversation conversation = await _context.Conversations.Include(x => x.Creator).Include(x => x.Recipient).FirstOrDefaultAsync(x => x.Id == request.ConversationId);

                if (conversation.Creator.Id != userId && conversation.Recipient.Id != userId)
                    throw new RestException(HttpStatusCode.Unauthorized, new { Conversation = "You're not a member of this conversation" });

                DateTime createdAt = DateTime.Now;
                Message message = new Message
                {
                    Body = request.Message,
                    Author = user,
                    CreatedAt = createdAt
                };

                conversation.Messages.Add(message);

                bool result = await _context.SaveChangesAsync() > 0;
                Response response = new Response
                {
                    Id = message.Id,
                    CreatedAt = createdAt
                };

                if (result) return response;

                throw new RestException(HttpStatusCode.BadRequest, new { SaveChanges = "Problem adding message" });

            }
        }
    }
}