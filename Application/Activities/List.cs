using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<ActivityDto>> { }

        public class Handler : IRequestHandler<Query, List<ActivityDto>>
        {
            private readonly DataBaseContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataBaseContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();

                User user = await _context.Users.AsNoTracking()
                .Include(x => x.BlockedUsers)
                    .ThenInclude(x => x.Blocked)
                        .ThenInclude(x => x.Activities)
                .Include(x => x.HiddenActivities)
                    .ThenInclude(x => x.Activity)
                .Include(x => x.Friends)
                    .ThenInclude(x => x.RequestedTo)
                .Include(x => x.FriendsOf)
                       .ThenInclude(x => x.RequestedBy)
                .FirstOrDefaultAsync(x => x.Id == userId);


                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { Error = "User doesn't exist" });

                ICollection<BlockedUser> blockedUsers = user.BlockedUsers;
                var excludedActivities = blockedUsers.SelectMany(x => x.Blocked.Activities.Select(x => x.Id)).ToList();

                var hiddenActivity = user.HiddenActivities.Count != 0 ? user.HiddenActivities.Select(x => x.Activity.Id).ToList() : Enumerable.Empty<Guid>();
                excludedActivities.AddRange(hiddenActivity);

                List<string> friends = user.Friends.Count != 0 ? user.Friends.Select(x => x.RequestedTo.Id).ToList() : new List<string>();
                IEnumerable<string> friendOf = user.Friends.Count != 0 ? user.Friends.Select(x => x.RequestedBy.Id).ToList() : Enumerable.Empty<string>();
                friends.AddRange(friendOf);
                friends.Add(user.Id);
                var activities = _context.AppActivity
                    .AsSingleQuery()
                    .Where(p => !excludedActivities.Contains(p.ActivityId) && friends.Contains(p.Activity.User.Id))
                    .OrderByDescending(x => x.CreatedAt)
                    .Take(10)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { userId = userId })
                    .ToList();
                return activities;
            }

        }

    }
}