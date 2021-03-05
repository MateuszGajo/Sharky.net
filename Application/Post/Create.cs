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

namespace Application.Post
{
    public class Create
    {
        public class Command : IRequest
        {
            public IFormFile File { get; set; }
            public string Content { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly DataBaseContext _context;
            public Handler(DataBaseContext context, IPhotoAccessor photoAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;

            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var PhotoUploadResult = _photoAccessor.AddPhoto(request.File);

                var Post = new Domain.Post
                {
                    User = null,
                    Content = request.Content,
                    Photo = new Photo
                    {
                        Id = PhotoUploadResult.PublicId,
                        Url = PhotoUploadResult.Url
                    },
                    CreateAt = DateTime.Now
                };

                _context.Posts.Add(Post);

                var success = await _context.SaveChangesAsync() >0;

                if(success) return Unit.Value;

                    throw new Exception("Problem savings changes");
            }
        }


    }
}