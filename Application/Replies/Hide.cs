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

namespace Application.Replies
{
    public class Hide
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataBaseContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataBaseContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.Include(x => x.HiddenReplies).FirstOrDefaultAsync(x => x.Id == userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                Reply reply = await _context.Replies.FindAsync(request.Id);
                if (reply == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Comment = "Comment doesn't exist" });

                HiddenReply hiddenReply = new HiddenReply
                {
                    User = user,
                    Reply = reply
                };

                user.HiddenReplies.Add(hiddenReply);

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new RestException(HttpStatusCode.BadRequest, new { SaveChanges = "Problem hidding comment" });
            }
        }
    }
}