using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using Domain;
using MediatR;
using Persistence;

namespace Application.Users
{
    public class Block
    {
        public class Command : IRequest
        {
            public string UserId { get; set; }
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
                    throw new RestException(HttpStatusCode.Unauthorized, new { Error = "User doesn't exist" });

                User blockedUser = await _context.Users.FindAsync(request.UserId);
                if (blockedUser == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Error = "User doesn't exist" });

                BlockedUser block = new BlockedUser
                {
                    User = user,
                    Blocked = blockedUser
                };

                user.BlockedUsers.Add(block);

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new RestException(HttpStatusCode.BadRequest, new { Error = "Problem blocking user" });

            }
        }
    }
}