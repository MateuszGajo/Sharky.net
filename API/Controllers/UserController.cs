using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interface;
using Application.Users;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Persistence;


namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly DataBaseContext _context;
        private readonly IMediator _mediator;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly UserManager<User> _userManager;
        public UserController(DataBaseContext context, IMediator mediator, IJwtGenerator jwtGenerator, UserManager<User> userManager)
        {
            _userManager = userManager;
            _jwtGenerator = jwtGenerator;
            _mediator = mediator;
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Details(string id)
        {
            return await _mediator.Send(new Details.Query { Id = id });
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<Unit>> Register(Register.Command command)
        {
            var user = await _mediator.Send(command);

            CreateToken(user);

            return Unit.Value;
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<Unit>> Login(Login.Command command, string predicate)
        {
            var user = await _mediator.Send(command);

            CreateToken(user);
            if (predicate == "true")
            {
                var creds = new CredsDto
                {
                    Email = command.Email,
                    Password = command.Password
                };
                CreateCredsToken(creds);
            }
            else
            {
                Response.Cookies.Delete("creds");
            }
            return Unit.Value;
        }

        [AllowAnonymous]
        [HttpDelete("logout")]
        public ActionResult<Unit> Logout()
        {
            Response.Cookies.Delete("Token");
            return Unit.Value;
        }
        [AllowAnonymous]
        [HttpPost("creds")]
        public ActionResult<CredsDto> GetCreds()
        {
            var token = Request.Cookies["creds"];

            if (!String.IsNullOrEmpty(token))
            {
                return _jwtGenerator.decodeToken(token);
            }
            return NotFound();
        }

        private void CreateToken(User user)
        {
            var token = _jwtGenerator.CreateToken(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now.AddDays(7),
                SameSite = SameSiteMode.Strict
            };
            Response.Cookies.Append("Token", token, cookieOptions);
        }

        private void CreateCredsToken(CredsDto creds)
        {
            var token = _jwtGenerator.CreateCredsToken(creds);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now.AddDays(7),
                SameSite = SameSiteMode.Strict
            };

            Response.Cookies.Append("creds", token, cookieOptions);
        }
    }
}