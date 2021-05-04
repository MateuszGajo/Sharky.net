using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Conversations;
using Application.Interface;
using Application.Users;
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
    public class ConversationHub : Hub
    {
        private string id;
        private readonly IMediator _mediator;
        private readonly IUserAccessor _userAccessor;
        private readonly static ConnectionMapping<string> _connections =
       new ConnectionMapping<string>();

        private readonly DataBaseContext _context;
        private readonly IMapper _mapper;

        public ConversationHub(IMediator mediator, IUserAccessor userAccessor, DataBaseContext context, IMapper mapper)
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

        public async Task<ActionResult<Unit>> ActivityAdded(Guid activityId)
        {
            string userId = _userAccessor.GetCurrentId();
            UserDto user = await _context.Users.Where(x => x.Id == userId).ProjectTo<UserDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();
            if (user == null) return Unit.Value;

            List<FriendDto> friends = await _context
            .Friends
            .Where(x => x.RequestedBy.Id == userId || x.RequestedTo.Id == userId)
            .Select(x => new FriendDto
            {
                User = x.RequestedBy.Id != userId ? x.RequestedBy : x.RequestedTo
            })
            .ToListAsync();


            foreach (var friend in friends)
            {
                // var not = _context.AppNotifications.FirstOrDefault(x => x.UserId == friend.User.Id);
                // not.NotificationsCount += 1;
                friend.User.NotificationsCount += 1;
                System.Console.WriteLine(friend.User.NotificationsCount);
                foreach (var connectionId in _connections.GetConnections(friend.User.Id))
                {
                    await Clients
                    .Client(connectionId)
                    .SendAsync("activityAdded", activityId, user);
                }
            }

            await _context.SaveChangesAsync();
            return Unit.Value;
        }


        public override async Task OnConnectedAsync()
        {
            string userId = _userAccessor.GetCurrentId();
            _connections.Add(userId, Context.ConnectionId);
            await base.OnConnectedAsync();
        }
    }
}