using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class GetNotification
    {

        public class Response
        {
            public int NotificationCount { get; set; }
            public int MessagesCount { get; set; }
            public int FriendRequestCount { get; set; }
        }
        public class Query : IRequest<Response> { }

        public class Handler : IRequestHandler<Query, Response>
        {
            private readonly DataBaseContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataBaseContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                return await _context.Users.Where(x => x.Id == userId).Select(x => new Response()
                {
                    NotificationCount = x.NotificationsCount,
                    MessagesCount = x.MessagesCount,
                    FriendRequestCount = x.FriendRequestCount
                }).FirstOrDefaultAsync();

            }
        }
    }
}