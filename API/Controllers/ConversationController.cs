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

        [HttpPost("create")]

        public async Task<ActionResult<Create.Response>> create(Create.Command command)
        {
            return await _mediator.Send(command);
        }

        [HttpGet("{id}/messages")]

        public async Task<ActionResult<List<MessageDto>>> messagesList(Guid id)
        {
            return await _mediator.Send(new ListMessages.Query { ConversationId = id });
        }

    }
}