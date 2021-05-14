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
using Persistence;

namespace Application.Friends
{
    public class Add
    {
        public class Response
        {
            public UserDto User { get; set; }
            public DateTime RequestedAt { get; set; }
            public Guid FriendshipId { get; set; }
            public Guid NotifyId { get; set; }
        }
        public class Command : IRequest<Response>
        {
            public string UserId { get; set; }
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

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User requestedByUser = await _context.Users.FindAsync(userId);
                if (requestedByUser == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { user = "user doesn't exsit" });

                User requestedToUser = await _context.Users.FindAsync(request.UserId);
                if (requestedToUser == null)
                    throw new RestException(HttpStatusCode.NotFound, new { user = "User doesn't exist" });

                DateTime date = DateTime.Now;

                Conversation conversation = new Conversation
                {
                    Id = Guid.NewGuid(),
                    Creator = requestedByUser,
                    Recipient = requestedToUser,
                };

                UserFriendship friendship = new UserFriendship
                {
                    Id = Guid.NewGuid(),
                    RequestedBy = requestedByUser,
                    RequestedTo = requestedToUser,
                    RequestTime = date,
                    FriendRequestFlag = FriendRequestFlag.None,
                    Conversation = conversation
                };

                Domain.Notification notification = new Domain.Notification
                {
                    Id = Guid.NewGuid(),
                    User = requestedByUser,
                    Type = "friend",
                    Action = "add",
                    CreatedAt = date,
                    RecipientId = requestedToUser.Id,
                    RefId = friendship.Id,
                };

                requestedByUser.Friends.Add(friendship);
                requestedToUser.FriendsOf.Add(friendship);
                _context.UserFriendships.Add(friendship);
                _context.Notifications.Add(notification);

                Response response = new Response
                {
                    User = _mapper.Map<UserDto>(requestedByUser),
                    RequestedAt = date,
                    FriendshipId = friendship.Id,
                    NotifyId = notification.Id
                };

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return response;

                throw new Exception("problem adding friend");
            }
        }
    }
}