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
    public class AcceptRequest
    {
        public class Command : IRequest
        {
            public Guid FriendshipId { get; set; }

            public Guid NotifyId { get; set; }
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

                UserFriendship friendship = await _context.UserFriendships.Include(x => x.RequestedTo).FirstOrDefaultAsync(x => x.Id == request.FriendshipId);
                if (friendship.RequestedTo.Id != userId)
                    throw new RestException(HttpStatusCode.Forbidden, new { friendship = "You aren't part of this relation" });

                Domain.Notification notification = await _context.Notifications.FindAsync(request.NotifyId);
                if (notification == null)
                    throw new RestException(HttpStatusCode.NotFound, new { notification = "Notification doesn't exist" });

                friendship.FriendRequestFlag = FriendRequestFlag.Approved;
                _context.Notifications.Remove(notification);

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new Exception("problem accepting friend request");
            }
        }
    }
}