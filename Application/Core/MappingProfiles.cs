using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Application.Activities;
using Application.Comments;
using Application.Replies;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : AutoMapper.Profile
    {
        public MappingProfiles()
        {
            string userId = null;
            IEnumerable<Guid> hiddenElements = new List<Guid>();
            CreateMap<ActivityDto, ActivityDto>();

            CreateMap<Activity, ActivityDto>()
            .ForMember(d => d.Likes, o => o.MapFrom(s => s.Likes.Count()))
             .ForMember(d => d.IsLiked, o => o.MapFrom(s => s.Likes.FirstOrDefault(x => x.User.Id == userId) == null ? false : true));

            CreateMap<User, UserDto>();

            CreateMap<Comment, CommentDto>()
                 .ForMember(d => d.Likes, o => o.MapFrom(s => s.Likes.Count()))
                 .ForMember(d => d.isHidden, o => o.MapFrom(s => hiddenElements.Contains(s.Id)))
                 .ForMember(d => d.isLiked, o => o.MapFrom(s => s.Likes.FirstOrDefault(x => x.User.Id == userId) == null ? false : true));

            CreateMap<Reply, ReplyDto>()
                  .ForMember(d => d.Likes, o => o.MapFrom(s => s.Likes.Count()))
                  .ForMember(d => d.isHidden, o => o.MapFrom(s => hiddenElements.Contains(s.Id)))
                  .ForMember(d => d.isLiked, o => o.MapFrom(s => s.Likes.FirstOrDefault(x => x.User.Id == userId) == null ? false : true));
        }
    }
}