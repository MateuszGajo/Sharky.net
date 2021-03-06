using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
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
                string userId = request.Id ?? _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);

                return await _context.Users.Where(x => x.Id == userId).ProjectTo<UserDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();
            }
        }
    }
}