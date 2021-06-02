using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.SignalR;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ActivityController
    {
        private readonly IMediator _mediator;

        public ActivityController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<ActivityDto>>> List(string userId)
        {
            return await _mediator.Send(new List.Query { UserId = userId });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> Details(Guid id)
        {
            return await _mediator.Send(new Details.Query { Id = id });
        }

        [HttpPut("{id}/share")]
        public async Task<ActionResult<Share.Response>> Share(Share.Command command, Guid id)
        {
            command.ActivityId = id;
            return await _mediator.Send(command);
        }

        [HttpDelete("{id}/unshare")]
        public async Task<ActionResult<Unit>> Unshare(Guid id)
        {
            return await _mediator.Send(new Unshare.Command { Id = id });
        }



        [HttpPost("create")]
        public async Task<ActionResult<Create.Response>> Create([FromForm] Create.Command command)
        {
            return await _mediator.Send(command);

        }

        [HttpDelete("{id}/unlike")]
        public async Task<ActionResult<Unit>> UnLike(Guid id)
        {
            return await _mediator.Send(new Unlike.Command { Id = id });
        }

        [HttpPut("{id}/edit")]
        public async Task<ActionResult<Edit.Response>> Edit([FromForm] Edit.Command command, Guid id)
        {
            command.Id = id;
            return await _mediator.Send(command);
        }

        [HttpDelete("{id}")]

        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await _mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPut("{id}/hide")]
        public async Task<ActionResult<Unit>> Hide(Guid id)
        {
            return await _mediator.Send(new Hide.Command { Id = id });
        }
    }
}