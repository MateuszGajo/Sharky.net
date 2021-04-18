using System;
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

namespace Application.Comments
{
    public class List
    {
        public class Query : IRequest<List<CommentDto>>
        {
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<CommentDto>>
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

            public async Task<List<CommentDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users
                .AsNoTracking()
                .Include(x => x.HiddenComments)
                    .ThenInclude(x => x.Comment)
                .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { user = "User doesn't exist" });

                var excludedComments = user.HiddenComments.Count() != 0 ? user.HiddenComments.Select(x => x.Comment.Id) : Enumerable.Empty<Guid>();

                return await _context.Comments
                .Where(x => x.Activity.Id == request.ActivityId)
                .OrderByDescending(c => c.CreatedAt)
                .Take(10)
                .ProjectTo<CommentDto>(_mapper.ConfigurationProvider, new { userId = userId, hiddenElements = excludedComments })
                .ToListAsync();
            }
        }
    }
}