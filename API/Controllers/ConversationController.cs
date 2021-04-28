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

        public async Task<ActionResult<Create.Response>> Create(Create.Command command)
        {
            return await _mediator.Send(command);
        }

        [HttpGet("{id}/messages")]

        public async Task<ActionResult<List<MessageDto>>> MessagesList(Guid id)
        {
            return await _mediator.Send(new ListMessages.Query { ConversationId = id });
        }

        [HttpPut("{id}/message/add")]

        public async Task<ActionResult<AddMessage.Response>> MessageAdd(AddMessage.Command command, Guid id)
        {
            command.ConversationId = id;
            return await _mediator.Send(command);
        }

    }
}