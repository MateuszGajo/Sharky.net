using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<ActionResult<List<ActivityDto>>> List()
        {
            return await _mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Details(Guid id)
        {
            return await _mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost("create")]
        public async Task<ActionResult<Create.Response>> Create([FromForm] Create.Command command)
        {
            return await _mediator.Send(command);
        }

        [HttpPut("{id}/like")]
        public async Task<ActionResult<Unit>> Like(Guid id)
        {
            return await _mediator.Send(new Application.Activities.Like.Command { Id = id });
        }

        [HttpPut("{id}/unlike")]
        public async Task<ActionResult<Unit>> UnLike(Guid id)
        {
            return await _mediator.Send(new Application.Activities.UnLike.Command { Id = id });
        }

        [HttpPut("{id}/edit")]
        public async Task<ActionResult<Application.Activities.Edit.Response>> Edit([FromForm] Edit.Command command, Guid id)
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
            System.Console.WriteLine("hide");
            return await _mediator.Send(new Hide.Command { Id = id });
        }

        [HttpPut("{postId}/comment/create")]
        public async Task<ActionResult<Application.Activities.Comments.Create.Response>> CreateComment(Application.Activities.Comments.Create.Command command, Guid postId)
        {
            command.PostId = postId;
            return await _mediator.Send(command);
        }

        [HttpPut("{postId}/comment/{commentId}/edit")]
        public async Task<ActionResult<Unit>> CreateComment(Application.Activities.Comments.Edit.Command command, Guid commentId)
        {
            command.CommentId = commentId;
            return await _mediator.Send(command);
        }

        [HttpPut("{postId}/comment/{commentId}/reply/create")]
        public async Task<ActionResult<Application.Activities.Comments.Replies.Create.Response>> CreateReply(Application.Activities.Comments.Replies.Create.Command command, Guid postId, Guid commentId)
        {
            command.PostId = postId;
            command.CommentId = commentId;
            return await _mediator.Send(command);
        }
    }
}