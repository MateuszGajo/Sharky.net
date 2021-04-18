using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Replies;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ReplyController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ReplyController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<ReplyDto>>> List(Guid commentId)
        {
            return await _mediator.Send(new List.Query { CommentId = commentId });
        }

        [HttpDelete("{id}")]

        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await _mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("create")]
        public async Task<ActionResult<Create.Response>> CreateReply(Create.Command command)
        {
            return await _mediator.Send(command);
        }

        [HttpPut("{id}/like")]
        public async Task<ActionResult<Unit>> Like(Guid id)
        {
            return await _mediator.Send(new Like.Command { Id = id });
        }

        [HttpDelete("{id}/unlike")]
        public async Task<ActionResult<Unit>> UnLike(Guid id)
        {
            return await _mediator.Send(new Unlike.Command { Id = id });
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
    }
}