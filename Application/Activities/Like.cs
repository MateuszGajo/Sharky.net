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

namespace Application.Activities
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
                var userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                var activity = await _context.Activities.Include(x => x.Likes).ThenInclude(x => x.User).FirstOrDefaultAsync(x => x.Id == request.Id);
                if (activity == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { Error = "activity doesn't exist" });

                var like = activity.Likes.Where(x => x.User.Id == userId).FirstOrDefault();
                if (like != null)
                {
                    throw new RestException(HttpStatusCode.Forbidden, new { Errors = "You have already liked this post" });
                }

                var newLike = new Domain.Like
                {
                    User = user,
                    Activity = activity
                };

                activity.Likes.Add(newLike);
                activity.LikesCount += 1;

                var result = await _context.SaveChangesAsync() > 0;

                if (result) return Unit.Value;

                throw new RestException(HttpStatusCode.BadRequest, new { Errors = "Problem liking activity" });

            }
        }
    }
}