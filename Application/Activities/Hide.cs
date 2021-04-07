using System;
using System.Collections.Generic;
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
    public class Hide
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataBaseContext _context;
            private readonly IUserAccessor _usserAccessor;
            public Handler(DataBaseContext context, IUserAccessor usserAccessor)
            {
                _usserAccessor = usserAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                string userId = _usserAccessor.GetCurrentId();
                Activity activity = await _context.Activities.FindAsync(request.Id);
                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Error = "Activity doesn't exist" });

                HiddenActivity hiddenActivity = await _context.HiddenActivites.Include(x => x.Activities).FirstOrDefaultAsync(x => x.UserId == userId);
                if (hiddenActivity == null)
                {
                    hiddenActivity = new HiddenActivity
                    {
                        UserId = userId,
                        Activities = new List<Activity>()
                    };
                    hiddenActivity.Activities.Add(activity);
                    _context.HiddenActivites.Add(hiddenActivity);
                }
                else
                {
                    hiddenActivity.Activities.Add(activity);
                }

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new RestException(HttpStatusCode.BadRequest, new { Error = "Problem hidding activity" });
            }
        }
    }
}