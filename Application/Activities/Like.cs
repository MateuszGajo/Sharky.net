using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Like
    {

        public class Response
        {
            public string AuthorId { get; set; }
            public Guid ActivityId { get; set; }
            public UserDto User { get; set; }
            public Guid? NotifyId { get; set; }
            public bool IsNotification { get; set; }
        }
        public class Command : IRequest<Response>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Response>
        {
            private readonly DataBaseContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            public Handler(DataBaseContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _mapper = mapper;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                var userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized, new { User = "User doesn't exist" });

                var activity = await _context.Activities.Include(x => x.Likes).ThenInclude(x => x.User).Include(x => x.User).FirstOrDefaultAsync(x => x.Id == request.Id);
                if (activity == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { Error = "activity doesn't exist" });

                var like = activity.Likes.Where(x => x.User.Id == userId).FirstOrDefault();
                if (like != null)
                {
                    throw new RestException(HttpStatusCode.Forbidden, new { Errors = "You have already liked this post" });
                }

                var newLike = new Domain.Like
                {
                    User = user,
                    Activity = activity
                };
                Domain.Notification notification = new Domain.Notification();
                bool isNotification = true;

                if (user.Id != activity.User.Id)
                {
                    Domain.Notification existNotification = _context.Notifications
                    .Where(x => x.RefId == activity.Id && x.User.Id == user.Id && x.Type == "post" && x.Action == "liked")
                    .FirstOrDefault();
                    if (existNotification == null)
                    {
                        notification = new Domain.Notification
                        {

                            User = user,
                            Type = "post",
                            Action = "liked",
                            CreatedAt = DateTime.Now,
                            RecipientId = activity.User.Id,
                            RefId = activity.Id
                        };
                        activity.User.NotificationsCount += 1;
                        _context.Notifications.Add(notification);
                    }
                    else isNotification = false;
                }

                activity.Likes.Add(newLike);
                activity.LikesCount += 1;

                var result = await _context.SaveChangesAsync() > 0;
                Response response = new Response
                {
                    AuthorId = activity.User.Id,
                    ActivityId = activity.Id,
                    User = _mapper.Map<UserDto>(user),
                    NotifyId = notification.Id == null ? notification.Id : Guid.Empty,
                    IsNotification = isNotification
                };

                if (result) return response;

                throw new RestException(HttpStatusCode.BadRequest, new { Errors = "Problem liking activity" });

            }
        }
    }
}