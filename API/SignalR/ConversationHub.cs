using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Conversations;
using Application.Users;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class ConversationHub : Hub
    {
        private readonly IMediator _mediator;
        public ConversationHub(IMediator mediator)
        {
            _mediator = mediator;
        }


        public async Task<ActionResult<AddMessage.Response>> AddMessage(AddMessage.Command command)
        {
            var resp = await _mediator.Send(command);

            await Clients.OthersInGroup("Conversation" + command.ConversationId.ToString())
           .SendAsync("ReciveMessage", resp.Id, command.Message, command.ConversationId, resp.CreatedAt, resp.User, resp.FriendId);
            return resp;
        }

        public override async Task OnConnectedAsync()
        {
            List<FriendDto> friends = await _mediator.Send(new Friends.Query());
            foreach (var friend in friends)
            {
                var conversationId = friend.Conversation?.Id;
                if (conversationId != null)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Conversation" + Convert.ToString(friend.Conversation.Id));
                }

            }
        }

        public async Task SendMessage(string message, Guid conversationId)
        {

            DateTime createdAt = DateTime.Now;
            User user = new User
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = "aaa",
                LastName = "bb"
            };
            await Clients.OthersInGroup("Conversation" + conversationId.ToString()).SendAsync("ReciveMessage", message, conversationId, createdAt, user);
        }
    }
}