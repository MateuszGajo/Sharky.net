using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using Application.validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.Settings
{
    public class EditPassword
    {
        public class Command : IRequest
        {
            public string CurrentPassword { get; set; }
            public string NewPassword { get; set; }
        }

        public class CommandValidation : AbstractValidator<Command>
        {

            public CommandValidation()
            {
                RuleFor(x => x.CurrentPassword).Password();
                RuleFor(x => x.NewPassword).Password();
            }

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataBaseContext _context;
            private readonly UserManager<User> _userManager;
            public Handler(DataBaseContext context, IUserAccessor userAccessor, UserManager<User> userManager)
            {
                _userManager = userManager;
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { user = "user doesn't exist" });

                var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

                if (result.Succeeded) return Unit.Value;

                throw new RestException(HttpStatusCode.Forbidden, new { password = "Password incorrect" });

            }
        }
    }
}