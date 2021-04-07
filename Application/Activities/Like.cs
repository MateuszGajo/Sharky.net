using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Like
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataBaseContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataBaseContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var post = await _context.Activities.FindAsync(request.Id);

                if (post == null) throw new RestException(HttpStatusCode.BadRequest, new { Error = "Post doesn't exist" });

                var userId = _userAccessor.GetCurrentId();

                var like = new Domain.Like
                {
                    UserId = userId,
                };

                post.Likes.Add(like);

                var result = await _context.SaveChangesAsync() > 0;

                if (result) return Unit.Value;

                throw new RestException(HttpStatusCode.BadRequest, new { Errors = "Problem liking post" });

            }
        }
    }
}