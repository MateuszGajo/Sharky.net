using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Conversations;
using Application.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.SignalR
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class CommonHub : Hub
    {
        private string id;
        private readonly IMediator _mediator;
        private readonly IUserAccessor _userAccessor;
        private readonly static ConnectionMapping<string> _connections =
       new ConnectionMapping<string>();

        private readonly DataBaseContext _context;
        private readonly IMapper _mapper;

        public CommonHub(IMediator mediator, IUserAccessor userAccessor, DataBaseContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            _userAccessor = userAccessor;
            _mediator = mediator;
        }
        public async Task<ActionResult<AddMessage.Response>> AddMessage(AddMessage.Command command)
        {
            var resp = await _mediator.Send(command);

            foreach (var connectionId in _connections.GetConnections(resp.FriendId))
            {
                await Clients
                .Client(connectionId)
                .SendAsync("reciveMessage", resp.Id, command.Message, command.ConversationId, resp.CreatedAt, resp.User, command.FriendshipId);
            }
            return resp;
        }

        public async Task<ActionResult<Unit>> LikeActivity(Guid id)
        {
            var response = await _mediator.Send(new Application.Activities.Like.Command { Id = id });
            if (response.AuthorId != response.User.Id && response.IsNotification)
            {
                foreach (var connectionId in _connections.GetConnections(response.AuthorId))
                {
                    await Clients
                       .Client(connectionId)
                       .SendAsync("activityLiked", response.NotifyId, response.ActivityId, response.User, DateTime.Now);
                }
            }
            return Unit.Value;
        }

        public class CreateCommentResponse
        {
            public Guid Id { get; set; }
            public DateTime CreatedAt { get; set; }
        }
        public async Task<ActionResult<CreateCommentResponse>> CreateComment(Guid activityId, string content)
        {
            var response = await _mediator.Send(new Application.Comments.Create.Command { ActivityId = activityId, Content = content });
            if (response.AuthorId != response.User.Id)
            {
                foreach (var connectionId in _connections.GetConnections(response.AuthorId))
                {
                    await Clients
                       .Client(connectionId)
                       .SendAsync("commentAdded", response.NotifyId, activityId, response.User, DateTime.Now);
                }
            }
            return new CreateCommentResponse
            {
                Id = response.Id,
                CreatedAt = response.CreatedAt
            };
        }

        public async Task<ActionResult<Unit>> AddFriend(String id)
        {
            var response = await _mediator.Send(new Application.Friends.Add.Command { UserId = id });

            foreach (var connectionId in _connections.GetConnections(id))
            {
                await Clients.Client(connectionId).SendAsync("friendRequestNotify", response.FriendshipId, response.RequestedAt, response.NotifyId, response.User);
            }
            return Unit.Value;
        }
        public async Task<ActionResult<Unit>> ActivityAdded(Guid activityId, Guid notifyId)
        {
            string userId = _userAccessor.GetCurrentId();
            UserDto user = await _context.Users.Where(x => x.Id == userId).ProjectTo<UserDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();
            if (user == null) return Unit.Value;

            List<FriendDto> friends = await _context
            .UserFriendships
            .Where(x => x.RequestedBy.Id == userId || x.RequestedTo.Id == userId)
            .Select(x => new FriendDto
            {
                User = x.RequestedBy.Id != userId ? x.RequestedBy : x.RequestedTo
            })
            .ToListAsync();


            foreach (var friend in friends)
            {
                friend.User.NotificationsCount += 1;
                foreach (var connectionId in _connections.GetConnections(friend.User.Id))
                {
                    await Clients
                    .Client(connectionId)
                    .SendAsync("activityAdded", notifyId, activityId, user, DateTime.Now);
                }
            }
            await _context.SaveChangesAsync();
            return Unit.Value;
        }
        public override async Task OnConnectedAsync()
        {
            string userId = _userAccessor.GetCurrentId();
            var user = await _context.Users.FindAsync(userId);

            user.IsActive = true;
            await _context.SaveChangesAsync();

            _connections.Add(userId, Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            string userId = _userAccessor.GetCurrentId();
            var user = await _context.Users.FindAsync(userId);

            _connections.Remove(userId, Context.ConnectionId);
            var connections = _connections.GetConnections(userId);
            if (connections.Count() == 0)
            {
                user.IsActive = false;
                await _context.SaveChangesAsync();
            }
            await base.OnDisconnectedAsync(ex);
        }
    }
}