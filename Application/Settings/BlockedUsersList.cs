using System.Collections.Generic;
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

namespace Application.Settings
{
    public class BlockedUsersList
    {
        public class Query : IRequest<List<BlockUserDto>> { }

        public class Handler : IRequestHandler<Query, List<BlockUserDto>>
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

            public async Task<List<BlockUserDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();

                return await _context.BlockedUsers
                .Where(x => x.User.Id == userId)
                .ProjectTo<BlockUserDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            }
        }
    }
}