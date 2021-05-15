using System.Threading.Tasks;
using Application.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class SettingsController
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

        [HttpPut("general/edit")]

        public async Task<ActionResult<Unit>> GeneralEdit(EditGeneral.Command command)
        {
            return await _mediator.Send(command);
        }
    }
}