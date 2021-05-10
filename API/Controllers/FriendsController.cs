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

        [HttpGet]
        public async Task<ActionResult<List<FriendDto>>> List(string userId, bool online)
        {
            return await _mediator.Send(new List.Query { Id = userId, OnlineFriends = online });
        }
    }
}