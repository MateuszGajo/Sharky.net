using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly IMediator _mediator;
        public CommentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<CommentDto>>> List(Guid ActivityId)
        {
            return await _mediator.Send(new List.Query { ActivityId = ActivityId });
        }

        [HttpPut("{id}/hide")]
        public async Task<ActionResult<Unit>> Hide(Guid id)
        {
            return await _mediator.Send(new Hide.Command { Id = id });
        }

        [HttpDelete("{id}/unhide")]
        public async Task<ActionResult<Unit>> Unhide(Guid id)
        {
            return await _mediator.Send(new Unhide.Command { Id = id });
        }

        [HttpPut("create")]
        public async Task<ActionResult<Create.Response>> CreateComment(Create.Command command)
        {
            return await _mediator.Send(command);
        }

        [HttpPut("{id}/edit")]
        public async Task<ActionResult<Unit>> CreateComment(Edit.Command command, Guid id)
        {
            command.Id = id;
            return await _mediator.Send(command);
        }
    }
}