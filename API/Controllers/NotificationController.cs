using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Notification;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class NotificationController
    {
        private readonly IMediator _mediator;
        public NotificationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<Notification>>> List()
        {
            return await _mediator.Send(new List.Query { });
        }
    }
}