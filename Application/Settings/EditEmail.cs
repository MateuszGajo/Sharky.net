using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Application.Errors;
using Application.Interface;
using Application.validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Persistence;

namespace Application.Settings
{
    public class EditEmail
    {
        public class Command : IRequest
        {
            public string CurrentEmail { get; set; }
            public string NewEmail { get; set; }
        }

        public class CommandValidation : AbstractValidator<Command>
        {

            public CommandValidation()
            {
                RuleFor(x => x.CurrentEmail).EmailAddress();
                RuleFor(x => x.NewEmail).EmailAddress();
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
                var token = await _userManager.GenerateChangeEmailTokenAsync(user, request.NewEmail);
                var result = await _userManager.ChangeEmailAsync(user, request.NewEmail, token);

                if (result.Succeeded) return Unit.Value;

                throw new RestException(HttpStatusCode.Forbidden, new { password = "Email is already in use" });

            }
        }
    }
}