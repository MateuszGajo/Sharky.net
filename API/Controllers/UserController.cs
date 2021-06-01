using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interface;
using Application.Users;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
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
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        public UserController(DataBaseContext context, IMediator mediator, IJwtGenerator jwtGenerator, UserManager<User> userManager, IConfiguration config)
        {
            _config = config;
            _userManager = userManager;
            _jwtGenerator = jwtGenerator;
            _mediator = mediator;
            _context = context;
            _httpClient = new HttpClient();
        }

        [HttpGet]
        public async Task<ActionResult<List<ListDto>>> InviteList(int start, string filter)
        {
            return await _mediator.Send(new List.Query { Start = start, FilterText = filter });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDetailsDto>> Details(string id)
        {
            return await _mediator.Send(new MoreDetails.Query { Id = id });
        }

        [HttpPut("change/photo")]
        public async Task<ActionResult<ChangeProfile.Response>> ChangePhoto([FromForm] ChangeProfile.Command command)
        {
            return await _mediator.Send(command);
        }


        [HttpPut("{id}/block")]
        public async Task<ActionResult<Unit>> Block(string id)
        {
            return await _mediator.Send(new Block.Command { UserId = id });
        }

        [HttpGet("notification")]
        public async Task<ActionResult<GetNotification.Response>> Notification()
        {
            return await _mediator.Send(new GetNotification.Query { });
        }
        [HttpPut("notification/read")]
        public async Task<ActionResult<Unit>> ReadNotification()
        {
            return await _mediator.Send(new ReadNotification.Command { });
        }

        [HttpGet("verification")]
        public async Task<ActionResult<Application.Activities.UserDto>> Details()
        {
            return await _mediator.Send(new Application.Users.Details.Query());
        }

        [HttpPost("{id}/report")]
        public async Task<ActionResult<Unit>> Report(Application.Users.Report.Command command, string id)
        {
            command.UserId = id;
            return await _mediator.Send(command);
        }

        [HttpDelete("{id}/unblock")]
        public async Task<ActionResult<Unit>> Unblock(Guid id)
        {
            return await _mediator.Send(new Unblock.Command { Id = id });
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

        [HttpDelete("logout")]
        public ActionResult<Unit> Logout()
        {
            var token = _jwtGenerator.CreateEmptyToken();

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now.AddDays(-1),
                SameSite = SameSiteMode.None,
                Secure = true
            };

            Response.Cookies.Append("Token", token, cookieOptions);
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

        public class Body
        {
            public string Token { get; set; }
        }
        [AllowAnonymous]
        [HttpPost("google")]
        public async Task<ActionResult> Google(Body body)
        {

            var response = new HttpResponseMessage();
            string clientUrl = _config["Url:client"];

            try
            {
                response = await _httpClient.GetAsync($"https://oauth2.googleapis.com/tokeninfo?id_token={body.Token}");
                response.EnsureSuccessStatusCode();
            }
            catch (HttpRequestException e)
            {
                return Unauthorized("invalid token");
            }
            var data = JsonConvert.DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());
            string userId = (string)data["id"];

            var user = await _context.Users.FirstOrDefaultAsync(x => x.GoogleId == userId);

            if (user != null)
            {
                CreateToken(user);
                return Ok();
            }

            string firstName = "";
            if (data["given_name"] != null)
            {
                firstName = (string)data["given_name"];
            }
            string lastName = "";
            if (data["family_name"] != null)
            {
                lastName = (string)data["family_name"];
            }
            else
            {
                lastName = firstName;
            }

            string userName = firstName.ToLower() + lastName.ToLower();

            int nameCount = await _context.Users.CountAsync(x => x.UserName.StartsWith(userName)) + 1;

            var newUser = new User
            {
                FirstName = firstName,
                LastName = lastName,
                UserName = $"{userName + nameCount}",
                GoogleId = userId
            };

            await _context.Users.AddAsync(newUser);

            var result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                CreateToken(newUser);
                return Ok();
            }
            return BadRequest("Problem creating new user");

        }

        [AllowAnonymous]
        [HttpPost("facebook")]
        public async Task<ActionResult> Facebook(Body body)
        {

            string token = body.Token;

            var response = new HttpResponseMessage();


            try
            {
                response = await _httpClient.GetAsync($"https://graph.facebook.com/v10.0/me?access_token={token}&fields=name");
                response.EnsureSuccessStatusCode();
            }
            catch
            {
                return Unauthorized("invalid token");
            }

            var data = JsonConvert.DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());
            string userId = (string)data?.id;

            var user = await _context.Users.FirstOrDefaultAsync(x => x.FacebookId == userId);

            if (user != null)
            {
                CreateToken(user);
                return Ok("");
            }

            string userName = (string)data.name;
            string userNameLowerCase = userName.ToLower();
            string[] names = userName.Split(' ');
            string firstName = names[0];
            string lastName = "";
            if (names[1] != null)
            {
                lastName = names[1];
            }
            else
            {
                lastName = firstName;
            }

            int userCount = await _context.Users.CountAsync(x => x.UserName.StartsWith(userNameLowerCase)) + 1;

            var newUser = new User
            {
                FirstName = firstName,
                LastName = lastName,
                UserName = $"{userNameLowerCase + userCount}",
                FacebookId = userId
            };

            await _context.Users.AddAsync(newUser);

            var result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                CreateToken(newUser);
                return Ok("");
            }

            return BadRequest("problem creating user");
        }

        private void CreateToken(User user)
        {
            var token = _jwtGenerator.CreateToken(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now.AddDays(7),
                SameSite = SameSiteMode.None,
                Secure = true
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
                SameSite = SameSiteMode.None,
                Secure = true
            };

            Response.Cookies.Append("creds", token, cookieOptions);
        }
    }
}