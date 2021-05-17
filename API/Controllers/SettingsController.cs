using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;



namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly IMediator _mediator;
        public SettingsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("general")]
        public async Task<ActionResult<GeneralDto>> GeneralList()
        {
            return await _mediator.Send(new GeneralList.Query());
        }

        [HttpPut("password/edit")]
        public async Task<ActionResult<Unit>> EditPassword(EditPassword.Command command)
        {
            return await _mediator.Send(command);
        }


        [HttpPut("email/edit")]
        public async Task<ActionResult<Unit>> EditEmail(EditEmail.Command command)
        {
            return await _mediator.Send(command);
        }

        [HttpPut("general/edit")]

        public async Task<ActionResult<Unit>> GeneralEdit(EditGeneral.Command command)
        {
            return await _mediator.Send(command);
        }

        [HttpGet("user/blocked")]
        public async Task<ActionResult<List<BlockUserDto>>> usersBlocked()
        {
            return await _mediator.Send(new BlockedUsersList.Query());
        }
    }
}