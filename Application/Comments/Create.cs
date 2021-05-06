using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Application.Errors;
using Application.Interface;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Response
        {
            public DateTime CreatedAt { get; set; }
            public Guid Id { get; set; }
            public string AuthorId { get; set; }
            public UserDto User { get; set; }
            public Guid? NotifyId { get; set; }
        }
        public class Command : IRequest<Response>
        {
            public Guid ActivityId { get; set; }
            public string Content { get; set; }
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
                var user = await _context.Users.FindAsync(userId);
                if (user == null) throw new RestException(HttpStatusCode.Unauthorized, new { Error = "User dosen't exist" });

                var activity = await _context.Activities.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == request.ActivityId);
                if (activity == null) throw new RestException(HttpStatusCode.NotFound, new { Error = "Post doesn't exist" });

                DateTime date = DateTime.Now;

                var comment = new Comment
                {
                    Content = request.Content,
                    Author = user,
                    Activity = activity,
                    CreatedAt = date
                };

                Domain.Notification notification = new Domain.Notification();

                if (user.Id != activity.User.Id)
                {

                    notification = new Domain.Notification
                    {

                        User = user,
                        Type = "comment",
                        Action = "added",
                        CreatedAt = DateTime.Now,
                        RecipientId = activity.User.Id,
                        RefId = activity.Id
                    };
                    activity.User.NotificationsCount += 1;
                    _context.Notifications.Add(notification);
                }


                activity.CommentsCount += 1;
                activity.Comments.Add(comment);

                var result = await _context.SaveChangesAsync() > 0;
                Response response = new Response
                {
                    AuthorId = activity.User.Id,
                    Id = comment.Id,
                    User = _mapper.Map<UserDto>(user),
                    CreatedAt = date,
                    NotifyId = notification.Id
                };
                if (result) return response;

                throw new RestException(HttpStatusCode.BadRequest, new { Error = "Problem creating comment" });
            }
        }
    }
}