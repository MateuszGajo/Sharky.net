using System;
using System.Threading.Tasks;
using Application.Interface;
using Application.Users;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Persistence;


namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DataBaseContext _context;
        private readonly IMediator _mediator;
        private readonly IJwtGenerator _jwtGenerator;
        public UsersController(DataBaseContext context, IMediator mediator, IJwtGenerator jwtGenerator)
        {
            _jwtGenerator = jwtGenerator;
            _mediator = mediator;
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Details(string id)
        {
            return await _mediator.Send(new Details.Query { Id = id});
        }

        [HttpPost("register")]
        public async Task<ActionResult<Unit>> Register(Register.Command command)
        {
            var user = await _mediator.Send(command);

            CreateToken(user);

            return Unit.Value;
        }

        [HttpPost("login")]
        public async Task<ActionResult<Unit>> Login (Login.Command command)
        {
            var user = await _mediator.Send(command);

            CreateToken(user);
            return Unit.Value;
        }

        private  void CreateToken(User user)
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
    }
}