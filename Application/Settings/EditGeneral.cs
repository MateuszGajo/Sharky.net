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

namespace Application.Settings
{
    public class EditGeneral
    {
        public class Command : IRequest
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
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
                if (string.IsNullOrEmpty(request.FirstName) && string.IsNullOrEmpty(request.LastName))
                    throw new RestException(HttpStatusCode.Forbidden, new { value = "Value cannot be empty" });

                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { user = "User doesn't exist" });

                user.FirstName = user.FirstName != request.FirstName && !string.IsNullOrEmpty(request.FirstName) ? request.FirstName : user.FirstName;
                user.LastName = user.LastName != request.LastName && !string.IsNullOrEmpty(request.LastName) ? request.LastName : user.LastName;

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return Unit.Value;

                throw new Exception("You did no changes");
            }
        }
    }
}