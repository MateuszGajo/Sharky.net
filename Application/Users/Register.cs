using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using Application.validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.Users
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string confirmPassword { get; set; }
            public string phone { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Email).EmailAddress().NotEmpty();
                RuleFor(x => x.Password).Password();
                RuleFor(x => x.confirmPassword).Equal(x => x.Password);
                RuleFor(x => x.FirstName).NotEmpty();
                RuleFor(x => x.LastName).NotEmpty();
                RuleFor(x => x.phone).Phone();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataBaseContext _context;
            private readonly UserManager<User> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly HttpContext _httpContext;
            public Handler(DataBaseContext context, UserManager<User> userManager, IJwtGenerator jwtGenerator)
            {
                _jwtGenerator = jwtGenerator;
                _userManager = userManager;
                _context = context;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                {
                    throw new RestException(HttpStatusCode.Conflict, new {Error = "User already exists"});
                }

               int userCount = await _context.Users.CountAsync(x =>x.UserName.StartsWith(request.FirstName+request.LastName)) + 1;

                var user = new User
                {
                    Email = request.Email,
                    Firstname = request.FirstName,
                    Lastname = request.LastName,
                    UserName = $"{request.FirstName + request.LastName + userCount}"
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if(result.Succeeded) return user;

                    throw new RestException(HttpStatusCode.BadRequest, new {Error = "Problem creating user"});
            }
        }
    }
}