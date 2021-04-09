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

        [HttpPost("create")]
        public async Task<ActionResult<Create.Response>> CreateReply(Create.Command command)
        {
            return await _mediator.Send(command);
        }
    }
}