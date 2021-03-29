using System;
using System.Linq;
using Application.Activities;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : AutoMapper.Profile
    {
        public MappingProfiles()
        {
            string userId = null;

            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.Likes, o => o.MapFrom(s => s.Likes.Count()))
                .ForMember(d => d.IsLiked, o => o.MapFrom(s => s.Likes.FirstOrDefault(x => x.UserId == userId) == null ? false:true) );
            CreateMap<Domain.Like, Application.Activities.Like>();
            CreateMap<User, UserDto>();
        }
    }
}