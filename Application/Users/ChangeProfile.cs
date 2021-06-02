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
using Persistence;

namespace Application.Users
{
    public class ChangeProfile
    {
        public class Response
        {
            public Photo Photo { get; set; }
        }
        public class Command : IRequest<Response>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Response>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            private readonly DataBaseContext _context;
            public Handler(IPhotoAccessor photoAccessor, IUserAccessor userAccessor, DataBaseContext context)
            {
                _context = context;
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
            }

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                string userId = _userAccessor.GetCurrentId();
                User user = await _context.Users.FindAsync(userId);
                if (user == null) throw new RestException(HttpStatusCode.Unauthorized, new { user = "User doesn't exist" });

                if (request.File == null)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Error = "Chose a photo" });
                }

                PhotoUploadResult PhotoUploadResult = _photoAccessor.AddProfilePhoto(request.File);

                Photo photo = new Photo
                {
                    Id = PhotoUploadResult.PublicId,
                    Url = PhotoUploadResult.Url
                };

                user.Photo = photo;

                Response response = new Response
                {
                    Photo = photo
                };

                bool result = await _context.SaveChangesAsync() > 0;

                if (result) return response;
                throw new Exception("Problem adding photo");

            }
        }
    }
}