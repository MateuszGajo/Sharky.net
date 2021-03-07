using Domain;

namespace Application.Interface
{
    public interface IJwtGenerator
    {
        string CreateToken(User user);
    }
}