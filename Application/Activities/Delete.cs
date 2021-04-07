using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataBaseContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(IUserAccessor userAccessor, DataBaseContext context, IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await _context.Activities.Include(x => x.User).Include(x => x.Photo).FirstOrDefaultAsync(x => x.Id == request.Id);
                if (activity == null) throw new RestException(HttpStatusCode.NotFound, new { Error = "Activity doesn't exist" });

                string userId = _userAccessor.GetCurrentId();
                System.Console.WriteLine(activity.User);
                if (activity.User.Id != userId) throw new RestException(HttpStatusCode.Forbidden, new { Error = "You aren't author of this activity" });

                if (activity.Photo != null)
                {
                    var deletePhotoResult = await _photoAccessor.DeletePhoto(activity.Photo.Id);
                    if (deletePhotoResult == null)
                        throw new RestException(HttpStatusCode.NotFound, new { Error = "Photo doesn't exist" });
                }

                _context.Activities.Remove(activity);

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new RestException(HttpStatusCode.BadRequest, new { Error = "Problem deleting activity" });
            }
        }
    }
}