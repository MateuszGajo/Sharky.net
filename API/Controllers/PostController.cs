using System.Threading.Tasks;
using Application.Post;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class PostController
    {
        private readonly IMediator _mediator;
        public PostController(IMediator mediator)
        {
            _mediator = mediator;
        }

         [HttpPost("create")]
         public async Task<ActionResult<Unit>> Create([FromForm] Create.Command command)
         {
             return await _mediator.Send(command);
         }
    }
}