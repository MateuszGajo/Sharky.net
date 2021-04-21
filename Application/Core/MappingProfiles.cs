using System;
using System.Collections.Generic;
using System.Linq;
using Application.Activities;
using Application.Comments;
using Application.Replies;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : AutoMapper.Profile
    {
        public MappingProfiles()
        {
            string userId = null;
            IEnumerable<Guid> hiddenElements = new List<Guid>();

            CreateMap<AppActivity, ActivityDto>()
            .ForMember(d => d.ActivityId, o => o.MapFrom(s => s.Activity.Id))
            .ForMember(d => d.User, o => o.MapFrom(s => s.Activity.User))
            .ForMember(d => d.Content, o => o.MapFrom(s => s.Activity.Content))
            .ForMember(d => d.Photo, o => o.MapFrom(s => s.Activity.Photo))
            .ForMember(d => d.ModifiedAt, o => o.MapFrom(s => s.CreatedAt))
            .ForMember(d => d.CreatedAt, o => o.MapFrom(s => s.Activity.CreatedAt))
            .ForMember(d => d.Likes, o => o.MapFrom(s => s.Activity.LikesCount))
            .ForMember(d => d.IsLiked, o => o.MapFrom(s => s.Activity.Likes.FirstOrDefault(x => x.User.Id == userId) == null ? false : true))
            .ForMember(d => d.CommentsCount, o => o.MapFrom(s => s.Activity.CommentsCount))
            .ForMember(d => d.SharesCount, o => o.MapFrom(s => s.Activity.SharesCount))
            .ForMember(d => d.Share, o => o.MapFrom(s => s));

            CreateMap<AppActivity, ShareDto>()
            .ForMember(d => d.User, o => o.MapFrom(s => s.SharingUser))
            .ForMember(d => d.CreatedAt, o => o.MapFrom(s => s.CreatedAt))
            .ForMember(d => d.AppActivityId, o => o.MapFrom(s => s.AppActivityId));

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