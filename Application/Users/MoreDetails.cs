using System;
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
    public class MoreDetails
    {
        public class Query : IRequest<UserDetailsDto>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, UserDetailsDto>
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

            public async Task<UserDetailsDto> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = request.Id ?? _userAccessor.GetCurrentId();

                return await _context.Users.Where(x => x.Id == userId).ProjectTo<UserDetailsDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();
            }
        }
    }
}