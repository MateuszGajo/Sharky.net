using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Application.DTOs;
using Application.Interface;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Security
{
    public class JwtGenerator : IJwtGenerator
    {
        private readonly SymmetricSecurityKey _key;
        public JwtGenerator(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }

        public string CreateToken(User user)
        {
            var claims = new List<Claim>{
               new Claim("id", user.Id.ToString()),
               new Claim("firstName", user.FirstName),
               new Claim("lastName", user.LastName),
               new Claim("email", user.Email),
           };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public string CreateCredsToken(CredsDto Creds)
        {
            var claims = new List<Claim>{
               new Claim(JwtRegisteredClaimNames.Email, Creds.Email),
               new Claim("password", Creds.Password)
           };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public CredsDto decodeToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var decode = tokenHandler.ReadToken(token);
            var tokenS = decode as JwtSecurityToken;

            var email = tokenS.Claims.First(claim => claim.Type == "email").Value;
            var password = tokenS.Claims.First(claim => claim.Type == "password").Value;

            var creds = new CredsDto
            {
                Email = email,
                Password = password
            };
            return creds;
        }
    }
}