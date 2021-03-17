using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.Users
{
    public class Login
    {
        public class Command : IRequest<User>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly UserManager<User> _userManager;
            private readonly SignInManager<User> _signInManager;
            public Handler(UserManager<User> userManager, SignInManager<User> signInManager)
            {
                _signInManager = signInManager;
                _userManager = userManager;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);

                if (user == null) throw new RestException(HttpStatusCode.NotFound, new { error = "User doesn't exist" });

                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                if (result.Succeeded)
                {
                    return user;
                }
                throw new RestException(HttpStatusCode.BadRequest, new { error = "Problem logging user" });
            }
        }
    }
}