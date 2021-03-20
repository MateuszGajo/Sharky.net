using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using Application.DTOs;
using Application.Interface;
using Application.Users;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

        public ActionResult<Unit> TwitterCallback()
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
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(client.RequestUrl);
            request.Headers.Add("Authorization", auth);

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);
            string strResponse = reader.ReadToEnd();

            Uri myUri = new Uri("http://localhost:5000?" + strResponse);
            string realAuthToken = HttpUtility.ParseQueryString(myUri.Query).Get("oauth_token");
            string realAuthTokenSecret = HttpUtility.ParseQueryString(myUri.Query).Get("oauth_token_secret");
            string user_id = HttpUtility.ParseQueryString(myUri.Query).Get("user_id");

            client = new OAuthRequest()
            {
                Method = "GET",
                Type = OAuthRequestType.ProtectedResource,
                SignatureMethod = OAuthSignatureMethod.HmacSha1,
                ConsumerKey = ConsumerKey,
                ConsumerSecret = ConsumerSecret,
                Token = realAuthToken,
                TokenSecret = realAuthTokenSecret,
                RequestUrl = $"https://api.twitter.com/1.1/users/show.json?user_id={user_id}",
            };

            auth = client.GetAuthorizationHeader();
            request = (HttpWebRequest)WebRequest.Create(client.RequestUrl);
            request.Headers.Add("Authorization", auth);

            response = (HttpWebResponse)request.GetResponse();
            dataStream = response.GetResponseStream();
            reader = new StreamReader(dataStream);
            strResponse = reader.ReadToEnd();

            var objResponse = (JObject)JsonConvert.DeserializeObject(strResponse);
            string name = objResponse["name"].ToString();

            return Unit.Value;
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