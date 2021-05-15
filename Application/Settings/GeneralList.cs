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

namespace Application.Settings
{
    public class GeneralList
    {
        public class Query : IRequest<GeneralDto> { }

        public class Handler : IRequestHandler<Query, GeneralDto>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataBaseContext _context;
            private readonly IMapper _mapper;
            public Handler(DataBaseContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<GeneralDto> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { user = "user doesn't exist" });

                return await _context.Users
                            .AsNoTracking()
                            .Where(x => x.Id == userId)
                            .ProjectTo<GeneralDto>(_mapper.ConfigurationProvider)
                            .FirstOrDefaultAsync();
            }
        }
    }
}