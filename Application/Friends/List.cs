using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using Application.Users;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Persistence;

namespace Application.Friends
{
    public class List
    {
        public class Query : IRequest<List<FriendDto>>
        {
            public string Id { get; set; }
            public bool OnlineFriends { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<FriendDto>>
        {
            private readonly DataBaseContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            public Handler(DataBaseContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _mapper = mapper;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<List<FriendDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = request.Id ?? _userAccessor.GetCurrentId();
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                IQueryable<Friend> friends = null;

                if (request.OnlineFriends)
                {
                    friends = _context
                    .Friends
                    .Where(x => (x.RequestedBy.Id == userId && x.RequestedTo.IsActive == true || x.RequestedTo.Id == userId && x.RequestedBy.IsActive == true) && x.FriendRequestFlag == FriendRequestFlag.Approved);
                }
                else
                {
                    friends = _context
                .Friends
                .Where(x => (x.RequestedBy.Id == userId || x.RequestedTo.Id == userId) && x.FriendRequestFlag == FriendRequestFlag.Approved);
                }

                return friends.ProjectTo<FriendDto>(_mapper.ConfigurationProvider, new { userId = userId }).ToList();
            }
        }
    }
}