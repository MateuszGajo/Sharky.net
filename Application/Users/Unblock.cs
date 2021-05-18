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

namespace Application.Users
{
    public class Unblock
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

                BlockedUser blockedUser = await _context.BlockedUsers.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == request.Id);

                if (blockedUser.User.Id != userId)
                    throw new RestException(HttpStatusCode.Forbidden, new { unblock = "You did not block this user" });

                _context.BlockedUsers.Remove(blockedUser);

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new Exception("Problem unblocking user");
            }
        }
    }
}