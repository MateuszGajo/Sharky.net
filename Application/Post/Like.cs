using System;
using System.Threading;
using System.Threading.Tasks;
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
                
                var like = new Domain.Like{
                    UserId=Guid.NewGuid(),
                };

                if(post == null) throw new Exception("empty post");

                post.Likes.Add(like);

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return Unit.Value;

                throw new Exception("Problem liking post");

                throw new NotImplementedException();
            }
        }
    }
}