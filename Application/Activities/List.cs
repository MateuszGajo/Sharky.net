using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
                return await _context.Activities.Include(x => x.User).Include(x=>x.Comments).ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { userId = _userAccessor.GetCurrentId()}).AsQueryable()
                 .ToListAsync();
                //  return await _context.Activities.Include(x => x.User).Include(x => x.Comments).ThenInclude(x => x.Author).ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { userId = _userAccessor.GetCurrentId()})
                //  .ToListAsync();
            }
        }
    }
}