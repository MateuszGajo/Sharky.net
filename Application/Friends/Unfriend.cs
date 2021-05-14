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

namespace Application.Friends
{
    public class Unfriend
    {
        public class Command : IRequest
        {
            public Guid FriendshipId { get; set; }
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
                //tutajx2
                UserFriendship friendship = await _context
                .UserFriendships
                .Include(x => x.RequestedBy)
                .Include(x => x.RequestedTo)
                .FirstOrDefaultAsync(x => x.Id == request.FriendshipId);

                if (friendship.RequestedBy.Id != userId && friendship.RequestedTo.Id != userId)
                    throw new RestException(HttpStatusCode.Forbidden, new { friendship = "You are not part of this relation" });
                _context.UserFriendships.Remove(friendship);

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new Exception("problem unfriend user");
            }
        }
    }
}