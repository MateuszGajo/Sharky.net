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

namespace Application.Replies
{
    public class Like
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
                User user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                Reply reply = await _context
                    .Replies
                    .Include(x => x.Likes)
                        .ThenInclude(x => x.User)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                Domain.Like like = reply.Likes.Where(x => x.User.Id == userId).FirstOrDefault();
                if (like != null)
                    throw new RestException(HttpStatusCode.Forbidden, new { Like = "You have already liked this comment" });

                Domain.Like newLike = new Domain.Like
                {
                    User = user,
                    Reply = reply
                };

                reply.Likes.Add(newLike);
                reply.LikesCount += 1;

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new RestException(HttpStatusCode.BadGateway, new { SaveChanges = "Problem saving changes" });
            }
        }
    }
}