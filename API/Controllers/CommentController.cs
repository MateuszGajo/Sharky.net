using System;
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

        [HttpPut("{id}/hide")]
        public async Task<ActionResult<Unit>> Hide(Guid id)
        {
            return Unit.Value;
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