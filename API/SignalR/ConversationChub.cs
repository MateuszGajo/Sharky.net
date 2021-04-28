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

        public async Task<ActionResult<Create.Response>> Create(Create.Command command)
        {
            return await _mediator.Send(command);
        }

        // [HttpGet("{id}/messages")]

        public async Task<ActionResult<List<MessageDto>>> MessagesList(Guid id)
        {
            return await _mediator.Send(new ListMessages.Query { ConversationId = id });
        }

        // [HttpPut("{id}/message/add")]

        public async Task<ActionResult<AddMessage.Response>> MessageAdd(AddMessage.Command command, Guid id)
        {
            command.ConversationId = id;
            return await _mediator.Send(command);
        }

        public override async Task OnConnectedAsync()
        {
            List<FriendDto> friends = await _mediator.Send(new Friends.Query());
            foreach (var friend in friends)
            {
                var conversationId = friend.Conversation?.Id;
                if (conversationId != null)
                {
                    System.Console.WriteLine(friend.Conversation.Id);
                    await Groups.AddToGroupAsync(Context.ConnectionId, Convert.ToString(friend.Conversation.Id));
                }

            }
        }

        public async Task SendMessage(string message, Guid conversationId)
        {
            // System.Console.WriteLine(aa);
            // System.Console.WriteLine(bb);
            // System.Console.WriteLine(conversationId);
            DateTime createdAt = DateTime.Now;
            User user = new User
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = "aaa",
                LastName = "bb"
            };
            await Clients.Group(conversationId.ToString()).SendAsync("ReciveMessage", message, conversationId, createdAt, user);
        }
    }
}