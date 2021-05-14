using System;
using System.Linq;
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
    public class Create
    {

        public class Response
        {
            public Guid Id { get; set; }
            public Guid ConversationId { get; set; }
            public DateTime CreatedAt { get; set; }
        }
        public class Command : IRequest
        {
            public string Message { get; set; }
            public string RecipientId { get; set; }
            public Guid FriendshipId { get; set; }
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
                return Unit.Value;
                // string userId = _userAccessor.GetCurrentId();
                // User user = await _context.Users.FindAsync(userId);
                // if (user == null)
                //     throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                // User recipient = await _context.Users.FindAsync(request.RecipientId);
                // if (recipient == null)
                //     throw new RestException(HttpStatusCode.NotFound, new { Recipient = "Recipient doesn't exist" });

                // Friend friendship = await _context.Friends.FindAsync(request.FriendshipId);
                // if (friendship == null)
                //     throw new RestException(HttpStatusCode.NotFound, new { Friendship = "You aren't friends" });

                // Conversation conversation = await _context.Conversations.AsNoTracking().Include(x => x.Creator).Include(x => x.Recipient).FirstOrDefaultAsync(x =>
                // (x.Creator.Id == user.Id && x.Recipient.Id == recipient.Id) || (x.Creator.Id == recipient.Id && x.Recipient.Id == user.Id));
                // if (conversation != null)
                //     throw new RestException(HttpStatusCode.Forbidden, new { conversationId = conversation.Id, Conversation = "Conversation already exist" });

                // DateTime createdAt = DateTime.Now;
                // Guid messageId = Guid.NewGuid();
                // Guid conversationId = Guid.NewGuid();
                // Message message = new Message
                // {
                //     Id = Guid.NewGuid(),
                //     CreatedAt = createdAt,
                //     Body = request.Message,
                //     Author = user,
                // };
                // conversation = new Conversation
                // {
                //     Id = Guid.NewGuid(),
                //     Creator = user,
                //     Recipient = recipient,
                //     // LastMessageId = messageId,
                //     MessageTo = recipient.Id,
                //     FriendId = friendship.Id,
                //     MessagesCount = 1
                // };

                // conversation.Messages.Add(message);
                // _context.Conversations.Add(conversation);
                // friendship.Conversation = conversation;


                // bool result = await _context.SaveChangesAsync() > 0;
                // Response response = new Response
                // {
                //     Id = message.Id,
                //     CreatedAt = createdAt,
                //     ConversationId = conversationId
                // };
                // if (result) return response;

                // throw new RestException(HttpStatusCode.BadRequest, new { SaveChanges = "Problem creating conversation" });

            }
        }
    }
}