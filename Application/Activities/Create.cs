using System.Threading;
using System.Threading.Tasks;
using Application.Interface;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Domain;
using System;
using Persistence;
using Application.Errors;
using System.Net;
using Microsoft.EntityFrameworkCore;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id {get; set;}
            public IFormFile File { get; set; }
            public string Content { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly DataBaseContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataBaseContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _photoAccessor = photoAccessor;

            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                if (request.File == null && String.IsNullOrEmpty(request.Content))
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Error = "Content cannot be empty" });
                }
                var PhotoUploadResult = new Application.Photos.PhotoUploadResult();
                if (request.File != null)
                    PhotoUploadResult = _photoAccessor.AddPhoto(request.File);

                var userId = _userAccessor.GetCurrentId();
                var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);

                var Post = new Domain.Activity
                {
                    Id = request.Id,
                    User = user,
                    Content = request.Content,
                    Photo = request.File != null ? new Photo
                    {
                        Id = PhotoUploadResult.PublicId,
                        Url = PhotoUploadResult.Url
                    } : null,
                    CreatedAt = DateTime.Now
                };

                _context.Activities.Add(Post);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new RestException(HttpStatusCode.BadRequest, new { Error = "Problem creating post" });
            }
        }


    }
}