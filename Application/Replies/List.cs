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

namespace Application.Replies
{
    public class List
    {
        public class Query : IRequest<List<ReplyDto>>
        {
            public Guid CommentId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<ReplyDto>>
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

            public async Task<List<ReplyDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.AsNoTracking().Include(x => x.HiddenReplies).ThenInclude(x => x.Reply).FirstOrDefaultAsync(x => x.Id == userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                var excludedReplies = user.HiddenReplies.Count != 0 ? user.HiddenReplies.Select(x => x.Reply.Id) : Enumerable.Empty<Guid>();

                return await _context.Replies
                    .Where(x => x.Comment.Id == request.CommentId)
                    .OrderByDescending(x => x.CreatedAt)
                    .Take(10)
                    .ProjectTo<ReplyDto>(_mapper.ConfigurationProvider, new { userId = userId, hiddenElements = excludedReplies })
                    .ToListAsync();
            }
        }
    }
}