using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using Domain;
using MediatR;
using Persistence;

namespace Application.Friends
{
    public class Add
    {
        public class Command : IRequest
        {
            public string UserId { get; set; }
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
                User requestedByUser = await _context.Users.FindAsync(userId);
                if (requestedByUser == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { user = "user doesn't exsit" });

                User requestedToUser = await _context.Users.FindAsync(request.UserId);
                if (requestedToUser == null)
                    throw new RestException(HttpStatusCode.NotFound, new { user = "User doesn't exist" });

                Conversation conversation = new Conversation
                {
                    Id = Guid.NewGuid(),
                    Creator = requestedByUser,
                    Recipient = requestedToUser,
                };

                UserFriendship friendship = new UserFriendship
                {
                    Id = Guid.NewGuid(),
                    RequestedBy = requestedByUser,
                    RequestedTo = requestedToUser,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.None,
                    Conversation = conversation
                };

                Domain.Notification notification = new Domain.Notification
                {
                    User = requestedByUser,
                    Type = "friend",
                    Action = "add",
                    CreatedAt = DateTime.Now,
                    RecipientId = requestedToUser.Id
                };

                requestedByUser.Friends.Add(friendship);
                requestedToUser.FriendsOf.Add(friendship);
                _context.UserFriendships.Add(friendship);
                _context.Notifications.Add(notification);

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new Exception("problem adding friend");
            }
        }
    }
}