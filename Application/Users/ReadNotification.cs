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
    public class ReadNotification
    {
        public class Command : IRequest
        {

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
                if (user == null) throw new RestException(HttpStatusCode.Unauthorized, new { user = "User doesn't exist" });

                user.NotificationsCount = 0;

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new Exception("Problem reading notification");
            }
        }
    }
}