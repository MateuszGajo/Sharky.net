using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interface;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.Errors;
using System.Net;
using Domain;

namespace Application.Activities.Comments.Replies
{
    public class Create
    {

        public class Response
        {
            public DateTime CreatedAt { get; set; }
        }
        public class Command : IRequest<Response>
        {
            public Guid PostId { get; set; }
            public Guid CommentId { get; set; }
            public Guid Id { get; set; }
            public string Content { get; set; }
        }

        public class Handler : IRequestHandler<Command, Response>
        {
            private readonly DataBaseContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataBaseContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                //var activity = await _context.Activities.FirstOrDefaultAsync(x => x.Id == request.PostId);
                var comment = await _context.Comments.FindAsync(request.CommentId);
                if (comment == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Error = "comment doesn't exist" });
                var userId = _userAccessor.GetCurrentId();
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Error = "user doesn't exist" });

                DateTime date = DateTime.Now;

                var reply = new Reply
                {
                    Id = request.Id,
                    Content = request.Content,
                    CreatedAt = date,
                    Author = user,
                    Comment = comment
                };

                // activity.Comments.

                comment.Replies.Add(reply);
                //_context.Activities.Update(activity);

                var response = new Response
                {
                    CreatedAt = date
                };

                var result = await _context.SaveChangesAsync() > 0;
                if (result) return response;

                throw new RestException(HttpStatusCode.BadGateway, new { Error = "Problem creating reply" });
            }
        }
    }
}