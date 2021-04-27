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

namespace Application.Conversations
{
    public class ListMessages
    {
        public class Query : IRequest<List<MessageDto>>
        {
            public Guid ConversationId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<MessageDto>>
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

            public async Task<List<MessageDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();

                Conversation conversation = await _context.Conversations.Include(x => x.Creator).Include(x => x.Recipient).FirstOrDefaultAsync(x => x.Id == request.ConversationId);
                System.Console.WriteLine(conversation.Creator.Id);
                System.Console.WriteLine(conversation.Recipient.Id);
                if (conversation.Creator.Id != userId && conversation.Recipient.Id != userId)
                    throw new RestException(HttpStatusCode.Unauthorized, new { Conversation = "You're not a member of this conversation" });

                return _context.Messages.Where(x => x.Conversation.Id == request.ConversationId).ProjectTo<MessageDto>(_mapper.ConfigurationProvider).ToList();
            }
        }
    }
}