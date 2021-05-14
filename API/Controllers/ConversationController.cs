using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Conversations;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]

    public class ConversationController : ControllerBase
    {

        private readonly IMediator _mediator;
        public ConversationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<ConversationDto>>> List(int from)
        {
            return await _mediator.Send(new List.Query { From = from });
        }

        // [HttpPost("create")]

        // public async Task<ActionResult<Create.Response>> Create(Create.Command command)
        // {
        //     return await _mediator.Send(command);
        // }

        [HttpGet("{id}/messages")]

        public async Task<ActionResult<List<MessageDto>>> MessagesList(Guid id, int start)
        {
            return await _mediator.Send(new ListMessages.Query { ConversationId = id, Start = start });
        }

        [HttpPut("{id}/messages/read")]

        public async Task<ActionResult<Unit>> readMessages(Guid id)
        {
            return await _mediator.Send(new ReadMessage.Command { ConversationId = id });
        }

    }
}