using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Share
    {
        public class Response
        {
            public DateTime CreatedAt { get; set; }
            public Guid Id { get; set; }
        }
        public class Command : IRequest<Response>
        {
            public Guid Id { get; set; }
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
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                Activity activity = await _context.Activities.FindAsync(request.Id);
                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Activity doesn't exsit" });

                DateTime date = DateTime.Now;
                AppActivity shareActivity = new AppActivity
                {
                    Activity = activity,
                    SharingUser = user,
                    CreatedAt = date
                };

                _context.AppActivity.Add(shareActivity);
                activity.SharesCount += 1;

                bool result = await _context.SaveChangesAsync() > 0;
                Response response = new Response
                {
                    CreatedAt = date,
                    Id = shareActivity.Id,
                };
                if (result) return response;

                throw new RestException(HttpStatusCode.BadRequest, new { SaveChanges = "Problem sharing activity" });
            }
        }
    }
}