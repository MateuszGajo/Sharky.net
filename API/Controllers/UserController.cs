using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using Application.DTOs;
using Application.Errors;
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
using Newtonsoft.Json.Linq;
using OAuth;
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

        [AllowAnonymous]
        [HttpPost("twitter")]


        public ActionResult<string> FacebookLogin()
        {
            string ConsumerKey = _config["Twitter:ConsumerKey"];
            string ConsumerSecret = _config["Twitter:ConsumerSecret"];

            OAuthRequest client = new OAuthRequest()
            {
                Method = "GET",
                Type = OAuthRequestType.RequestToken,
                SignatureMethod = OAuthSignatureMethod.HmacSha1,
                ConsumerKey = ConsumerKey,
                ConsumerSecret = ConsumerSecret,
                RequestUrl = "https://api.twitter.com/oauth/request_token",
                CallbackUrl = "http://127.0.0.1:5000/api/user/twitter/callback",
            };

            string auth = client.GetAuthorizationHeader();
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(client.RequestUrl);
            request.Headers.Add("Authorization", auth);

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);
            string strResponse = reader.ReadToEnd();

            return "https://api.twitter.com/oauth/authorize?" + strResponse;
        }



        [AllowAnonymous]
        [HttpGet("twitter/callback")]

        public async Task<ActionResult<Unit>> TwitterCallback()
        {
            string authToken = Request.Query["oauth_token"];
            string authVerifier = Request.Query["oauth_verifier"];

            string ConsumerKey = _config["Twitter:ConsumerKey"];
            string ConsumerSecret = _config["Twitter:ConsumerSecret"];

            OAuthRequest client = new OAuthRequest()
            {
                Method = "GET",
                Type = OAuthRequestType.AccessToken,
                SignatureMethod = OAuthSignatureMethod.HmacSha1,
                ConsumerKey = ConsumerKey,
                ConsumerSecret = ConsumerSecret,
                Token = authToken,
                RequestUrl = "https://api.twitter.com/oauth/access_token",
                Verifier = authVerifier
            };

            string auth = client.GetAuthorizationHeader();
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(client.RequestUrl);
            req.Headers.Add("Authorization", auth);

            HttpWebResponse response = (HttpWebResponse)req.GetResponse();
            Stream dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);
            string strResponse = reader.ReadToEnd();

            Uri myUri = new Uri("http://localhost:5000?" + strResponse);
            string realAuthToken = HttpUtility.ParseQueryString(myUri.Query).Get("oauth_token");
            string realAuthTokenSecret = HttpUtility.ParseQueryString(myUri.Query).Get("oauth_token_secret");
            string userId = HttpUtility.ParseQueryString(myUri.Query).Get("user_id");

            var user = await _context.Users.FirstOrDefaultAsync(x => x.TwitterId == userId);

            if (user != null)
            {
                CreateToken(user);
                Response.Redirect("http://localhost:3000/home");
                return Unit.Value;
            }

            client = new OAuthRequest()
            {
                Method = "GET",
                Type = OAuthRequestType.ProtectedResource,
                SignatureMethod = OAuthSignatureMethod.HmacSha1,
                ConsumerKey = ConsumerKey,
                ConsumerSecret = ConsumerSecret,
                Token = realAuthToken,
                TokenSecret = realAuthTokenSecret,
                RequestUrl = $"https://api.twitter.com/1.1/users/show.json?user_id={userId}",
            };

            auth = client.GetAuthorizationHeader();
            req = (HttpWebRequest)WebRequest.Create(client.RequestUrl);
            req.Headers.Add("Authorization", auth);

            response = (HttpWebResponse)req.GetResponse();
            dataStream = response.GetResponseStream();
            reader = new StreamReader(dataStream);
            strResponse = reader.ReadToEnd();

            var objResponse = (JObject)JsonConvert.DeserializeObject(strResponse);
            string name = objResponse["name"].ToString();

            int userCount = await _context.Users.CountAsync(x => x.UserName.StartsWith(name + name)) + 1;

            User newUser = new User
            {
                Firstname = name,
                Lastname = name,
                UserName = $"{name + name + userCount}",
                TwitterId = userId
            };

            _context.Users.Add(newUser);

            var success = await _context.SaveChangesAsync() > 0;
            if (success)
            {
                CreateToken(newUser);
                Response.Redirect("http://localhost:3000/home");
                return Unit.Value;
            }

            throw new RestException(HttpStatusCode.BadGateway, new { Error = "Problem authentication user" });
        }

        [AllowAnonymous]
        [HttpGet("facebook/callback")]

        public async Task<ActionResult<Unit>> FacebookCallback()
        {
            string clientSecret = _config["Facebook:clientSecret"];
            string code = Request.Query["code"];
            var response = await _httpClient.GetAsync($"https://graph.facebook.com/v10.0/oauth/access_token?client_id=487050989139304&redirect_uri=http://localhost:5000/api/user/facebook/callback&client_secret={clientSecret}&code={code}");
            var jsonResponse = JsonConvert.DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());
            string accessToken = (string)jsonResponse["access_token"];

            var userData = await _httpClient.GetAsync($"https://graph.facebook.com/v10.0/me?access_token={accessToken}&fields=name");
            var jsonUserData = JsonConvert.DeserializeObject<dynamic>(await userData.Content.ReadAsStringAsync());
            string userId = (string)jsonUserData.id;

            var user = await _context.Users.FirstOrDefaultAsync(x => x.FacebookId == userId);

            if (user != null)
            {
                CreateToken(user);
                Response.Redirect("http://localhost:3000/home");
                return Unit.Value;
            }

            string userName = (string)jsonUserData.name;
            string userNameLowerCase = userName.ToLower();
            string[] names = userName.Split(' ');
            string firstName = names[0];
            string lastName = names[1];

            int userCount = await _context.Users.CountAsync(x => x.UserName.StartsWith(userNameLowerCase)) + 1;

            var newUser = new User
            {
                Firstname = firstName,
                Lastname = lastName,
                UserName = $"{userNameLowerCase + userCount}",
                FacebookId = userId

            };

            await _context.Users.AddAsync(newUser);

            var result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                CreateToken(newUser);
                Response.Redirect("http://localhost:3000/home");
                return Unit.Value;
            }

            throw new RestException(HttpStatusCode.BadRequest, new { Error = "Can't authenticate user" });
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