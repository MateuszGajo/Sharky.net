using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using Domain;
using MediatR;
using Persistence;

namespace Application.Users
{
    public class Report
    {
        public class Command : IRequest
        {
            public string UserId { get; set; }
            public string[] Reasons { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataBaseContext _context;
            public Handler(DataBaseContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var reportReasons = new List<String>()
                {
                        "offensiveContent",
                        "spam",
                        "misleading",
                        "scam"
                };

                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                User reportedUser = await _context.Users.FindAsync(request.UserId);
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "User doesn't exist" });

                System.Console.WriteLine(request.Reasons);
                string[] userReasons = request.Reasons;
                List<Reason> reasons = new List<Reason>();
                bool isReason = false;

                for (int i = 0; i < userReasons.Length; i++)
                {
                    if (reportReasons.Contains(userReasons[i]))
                    {
                        reasons.Add(new Reason { Name = userReasons[i] });
                        isReason = true;
                    }
                }
                if (!isReason) throw new RestException(HttpStatusCode.BadGateway, new { Reason = "Report reason doesn't exist on the list" });

                Domain.Report report = new Domain.Report
                {
                    User = user,
                    ReportedUser = reportedUser,
                    CreatedAt = DateTime.Now,
                    Reasons = reasons
                };

                _context.Reports.Add(report);

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new RestException(HttpStatusCode.BadRequest, new { SaveChanges = "Problem reporting user" });

            }
        }
    }
}