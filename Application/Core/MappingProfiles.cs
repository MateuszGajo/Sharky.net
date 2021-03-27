using Application.Activities;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : AutoMapper.Profile
    {
        public MappingProfiles()
        {
            CreateMap<Post, ActivityDto>();
            CreateMap<Domain.Like, Application.Activities.Like>();
            CreateMap<User, UserDto>();
        }


    }
}