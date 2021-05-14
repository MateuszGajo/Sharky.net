using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Notification
{
    public class List
    {
        public class Query : IRequest<List<Domain.Notification>> { }

        public class Handler : IRequestHandler<Query, List<Domain.Notification>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataBaseContext _context;
            public Handler(DataBaseContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<List<Domain.Notification>> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();

                var friends = await _context.UserFriendships.Where(x => (x.RequestedBy.Id == userId && x.FriendRequestFlag == FriendRequestFlag.Approved)
                || (x.RequestedTo.Id == userId && x.FriendRequestFlag == FriendRequestFlag.Approved)).Select(x =>
                    x.RequestedBy.Id != userId ? x.RequestedBy.Id : x.RequestedTo.Id
                ).ToListAsync();

                var notification = await _context.Notifications
                        .Where(x => (x.RecipientId == userId || x.RecipientId == null && friends.Contains(x.User.Id)))
                        .Include(x => x.User)
                        .ToListAsync();

                return notification;
            }
        }
    }
}