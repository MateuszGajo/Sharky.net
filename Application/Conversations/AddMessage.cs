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
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Conversations
{


    public class AddMessage
    {
        public class Response
        {
            public DateTime CreatedAt { get; set; }
            public Guid Id { get; set; }
            public UserDto User { get; set; }
            public string FriendId { get; set; }
        }
        public class Command : IRequest<Response>
        {
            public Guid ConversationId { get; set; }
            public string Message { get; set; }
            public Guid FriendshipId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Response>
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

            public Guid Id { get; set; }
            public DateTime CreatedAt { get; set; }
            public string Body { get; set; }
            public User Author { get; set; }
            public Conversation Conversation { get; set; }

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                System.Console.WriteLine("nowa wiadomość");
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                Conversation conversation = await _context.Conversations.Include(x => x.Creator).Include(x => x.Recipient).FirstOrDefaultAsync(x => x.Id == request.ConversationId);

                if (conversation.Creator.Id != userId && conversation.Recipient.Id != userId)
                    throw new RestException(HttpStatusCode.Unauthorized, new { Conversation = "You're not a member of this conversation" });

                DateTime createdAt = DateTime.Now;
                Message message = new Message
                {
                    Body = request.Message,
                    Author = user,
                    CreatedAt = createdAt
                };

                conversation.Messages.Add(message);
                conversation.LastMessage = message;

                User messageTo = conversation.Recipient.Id == user.Id ? conversation.Creator : conversation.Recipient;
                if (conversation.MessageTo != messageTo.Id)
                {
                    conversation.MessageTo = messageTo.Id;
                    messageTo.MessagesCount += 1;
                }
                conversation.MessagesCount += 1;


                bool result = await _context.SaveChangesAsync() > 0;
                Response response = new Response
                {
                    Id = message.Id,
                    CreatedAt = createdAt,
                    User = _mapper.Map<UserDto>(user),
                    FriendId = messageTo.Id
                };

                if (result) return response;

                throw new RestException(HttpStatusCode.BadRequest, new { SaveChanges = "Problem adding message" });

            }
        }
    }
}