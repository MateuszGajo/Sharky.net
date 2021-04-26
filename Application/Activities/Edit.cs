using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interface;
using Application.Photos;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Response
        {
            public Photo Photo { get; set; }
        }
        public class Command : IRequest<Response>
        {
            public Guid Id { get; set; }
            public IFormFile File { get; set; }
            public string Content { get; set; }
        }

        public class Handler : IRequestHandler<Command, Response>
        {
            private readonly DataBaseContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(DataBaseContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _context = context;
            }

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await _context.Activities.Include(x => x.Photo).FirstOrDefaultAsync(x => x.Id == request.Id);
                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Error = "Activity doesn't exist" });


                Photo photo = null;
                if (request.File != null)
                {
                    if (activity.Photo != null)
                    {
                        var deletePhotoResult = await _photoAccessor.DeletePhoto(activity.Photo.Id);
                        if (deletePhotoResult == null)
                            throw new RestException(HttpStatusCode.NotFound, new { Error = "Photo doesn't exist" });
                    }

                    PhotoUploadResult resp = _photoAccessor.AddPhoto(request.File);
                    photo = new Photo
                    {
                        Id = resp.PublicId,
                        Url = resp.Url
                    };
                }

                activity.Content = request.Content != activity.Content ? request.Content : activity.Content;
                activity.Photo = photo == null ? activity.Photo : photo;
                var response = new Response
                {
                    Photo = photo
                };

                bool result = await _context.SaveChangesAsync() > 0;
                if (result) return response;

                throw new RestException(HttpStatusCode.BadRequest, new { Error = "Problem edditing activity" });
            }
        }
    }
}