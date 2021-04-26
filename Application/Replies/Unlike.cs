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
    public class Unlike
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
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
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                Reply reply = await _context.Replies
                    .Include(x => x.Likes)
                        .ThenInclude(x => x.User)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);
                if (reply == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Comment = "Comment doesn't exist" });

                Domain.Like like = reply.Likes.FirstOrDefault(x => x.User.Id == userId);
                if (like == null)
                    throw new RestException(HttpStatusCode.Forbidden, new { Like = "Comment isn't liked" });

                reply.Likes.Remove(like);
                reply.LikesCount -= 1;

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new RestException(HttpStatusCode.BadGateway, new { SaveChanges = "Problem unliking comment" });
            }
        }
    }
}