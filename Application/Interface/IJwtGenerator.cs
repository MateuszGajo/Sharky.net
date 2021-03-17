using Application.DTOs;
using Domain;

namespace Application.Interface
{
    public interface IJwtGenerator
    {
        string CreateToken(User user);
        string CreateCredsToken(CredsDto creds);
        CredsDto decodeToken(string token);
    }
}