using System.Collections.Generic;
using System.Linq;
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

namespace Application.Users
{
    public class List
    {
        public class Query : IRequest<List<ListDto>>
        {
            public int Start { get; set; }
#nullable enable
            public string? FilterText { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<ListDto>>
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
            public async Task<List<ListDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { user = "User doesn't exist" });

                List<ListDto> users = new List<ListDto>();

                if (request.FilterText != null)
                {
                    users = _context
                            .Users
                            .Where(x => x.FullName.Contains(request.FilterText.ToLower()) && x.Id != userId && !x.Friends.Any(x => x.RequestedTo.Id == userId) && !x.FriendsOf.Any(x => x.RequestedBy.Id == userId))
                            .Skip(request.Start)
                            .Take(30)
                            .ProjectTo<ListDto>(_mapper.ConfigurationProvider, new { userId = userId })
                            .ToList();
                }
                else
                {
                    users = _context
                         .Users
                         .Include(x => x.Friends)
                         .Include(x => x.FriendsOf)
                        .Where(x => x.Id != userId && !x.Friends.Any(x => x.RequestedTo.Id == userId) && !x.FriendsOf.Any(x => x.RequestedBy.Id == userId))
                          .Skip(request.Start)
                          .Take(30)
                         .ProjectTo<ListDto>(_mapper.ConfigurationProvider, new { userId = userId })
                         .ToList();
                }

                return users;

            }
        }
    }
}