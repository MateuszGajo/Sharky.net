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
            public Guid Id { get; set; }
        }
        public class Command : IRequest<Response>
        {
            public Guid PostId { get; set; }
            public Guid CommentId { get; set; }
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
                    Content = request.Content,
                    CreatedAt = date,
                    Author = user,
                    Comment = comment
                };


                comment.Replies.Add(reply);


                var result = await _context.SaveChangesAsync() > 0;
                var response = new Response
                {
                    CreatedAt = date,
                    Id = reply.Id

                };
                if (result) return response;

                throw new RestException(HttpStatusCode.BadGateway, new { Error = "Problem creating reply" });
            }
        }
    }
}