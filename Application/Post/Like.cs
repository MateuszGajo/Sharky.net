using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Persistence;

namespace Application.Post
{
    public class Like
    {
        public class Command : IRequest
        {
            public Guid PostId { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataBaseContext _context;
            public Handler(DataBaseContext context)
            {
                _context = context;
            }

            public async  Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var post = await _context.Posts.FindAsync(request.PostId);

                if(post == null) throw new RestException(HttpStatusCode.BadRequest, new {Error = "Post doesn't exist"});
                
                var like = new Domain.Like{
                    UserId=Guid.NewGuid(),
                };

                post.Likes.Add(like);

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return Unit.Value;

                throw new RestException(HttpStatusCode.BadRequest, new{Errors= "Problem liking post" });

            }
        }
    }
}