using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using Domain;
using MediatR;
using Persistence;

namespace Application.Conversations
{
    public class List
    {
        public class Query : IRequest<Conversation>
        {
            public string RecipientId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Conversation>
        {
            private readonly DataBaseContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataBaseContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Conversation> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                User recipient = await _context.Users.FindAsync(request.RecipientId);
                if (recipient == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "User doesn't exist" });

                Conversation conversation = _context.Conversations.Where(x =>
                (x.Creator.Id == userId && x.Recipient.Id == request.RecipientId) || (x.Creator.Id == request.RecipientId && x.Recipient.Id == userId)).FirstOrDefault();
                return conversation;

            }
        }
    }
}