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
    public class ReadMessage
    {
        public class Command : IRequest
        {
            public Guid ConversationId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataBaseContext _context;
            public Handler(DataBaseContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null) throw new RestException(HttpStatusCode.Unauthorized, new { user = "user doesn't exist" });

                Conversation conversation = await _context.Conversations.Include(x => x.Creator).Include(x => x.Recipient).FirstOrDefaultAsync(x => x.Id == request.ConversationId);
                if (conversation.Creator.Id != userId && conversation.Recipient.Id != userId)
                    throw new RestException(HttpStatusCode.Unauthorized, new { Conversation = "You're not a member of this conversation" });

                if (conversation.MessageTo != userId)
                    throw new RestException(HttpStatusCode.Forbidden, new { conversation = "You don't have unread messages" });

                conversation.MessageTo = null;
                user.MessagesCount -= 1;

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new RestException(HttpStatusCode.BadRequest, new { saveChanges = "problem saving read messages" });
            }
        }
    }
}