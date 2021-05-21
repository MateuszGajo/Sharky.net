using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Application.Errors;
using Application.Interface;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Users
{
    public class Details
    {
        public class Query : IRequest<UserDto>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, UserDto>
        {
            private readonly DataBaseContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataBaseContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Forbidden, new { user = "user doesn't exist" });

                return _mapper.Map<UserDto>(user);
            }
        }
    }
}