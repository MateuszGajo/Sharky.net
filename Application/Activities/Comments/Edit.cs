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
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid CommentId { get; set; }
            public string Content { get; set; }
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
                var comment = await _context.Comments.FindAsync(request.CommentId);
                if (comment == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Error = "Comment doesn't exist" });

                var userId = _userAccessor.GetCurrentId();
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Error = "User doesn't exist" });

                if (comment.Author.Id != userId)
                    throw new RestException(HttpStatusCode.Forbidden, new { Error = "You are not author of this comment" });

                comment.Content = request.Content;

                bool success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;

                throw new RestException(HttpStatusCode.BadGateway, new { Error = "Problem editting comment" });
            }
        }
    }
}