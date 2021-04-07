using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Comments
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
                var post = await _context.Activities.FindAsync(request.PostId);
                if (post == null) throw new RestException(HttpStatusCode.NotFound, new { Error = "Post doesn't exist" });

                var userId = _userAccessor.GetCurrentId();
                var user = await _context.Users.FindAsync(userId);
                if (user == null) throw new RestException(HttpStatusCode.NotFound, new { Error = "User dosen't exist" });

                DateTime date = DateTime.Now;

                var comment = new Comment
                {
                    Content = request.Content,
                    Author = user,
                    Activity = post,
                    CreatedAt = date
                };

                post.Comments.Add(comment);

                var result = await _context.SaveChangesAsync() > 0;
                var response = new Response { Id = comment.Id, CreatedAt = date };
                if (result) return response;

                throw new RestException(HttpStatusCode.BadRequest, new { Error = "Problem creating comment" });
            }
        }
    }
}