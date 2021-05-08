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

namespace Application.Conversations
{
    public class List
    {
        public class Query : IRequest<List<ConversationDto>>
        {
            public int From { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<ConversationDto>>
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

            public async Task<List<ConversationDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                List<ConversationDto> conversation = await _context
                .Conversations
                .Where(x => (x.Creator.Id == userId || x.Recipient.Id == userId) && x.LastMessage != null)
                .Skip(request.From)
                .Take(10)
                .ProjectTo<ConversationDto>(_mapper.ConfigurationProvider, new { userId = userId })
                .ToListAsync();

                return conversation;

            }
        }
    }
}