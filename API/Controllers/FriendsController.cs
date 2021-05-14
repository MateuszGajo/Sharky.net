using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Friends;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class FriendsController
    {
        private readonly IMediator _mediator;
        public FriendsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("online")]
        public async Task<ActionResult<List<OnlineFriendDto>>> OnlineList()
        {
            return await _mediator.Send(new ListOnline.Query());
        }

        [HttpGet]
        public async Task<ActionResult<List<FriendDto>>> List(string userId, string filter, int from)
        {
            return await _mediator.Send(new List.Query { Id = userId, FilterText = filter, From = from });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Unfriend(Guid id)
        {
            return await _mediator.Send(new Unfriend.Command { FriendshipId = id });
        }

        [HttpPut("{id}/accept")]
        public async Task<ActionResult<Unit>> AcceptRequest(AcceptRequest.Command command, Guid id)
        {
            command.FriendshipId = id;
            return await _mediator.Send(command);
        }

        [HttpPut("{id}/decline")]
        public async Task<ActionResult<Unit>> DeclineRequest(DeclineRequest.Command command, Guid id)
        {
            command.FriendshipId = id;
            return await _mediator.Send(command);
        }




    }
}