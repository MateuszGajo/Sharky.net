using System;
using System.Threading.Tasks;
using Application.Users;
using Domain;
using MediatR;
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
        public UsersController(DataBaseContext context, IMediator mediator)
        {
            _mediator = mediator;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<User>> Details()
        {
            return await _mediator.Send(new Details.Query{Id = Guid.NewGuid()});
        }
    }
}