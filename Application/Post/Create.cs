using System.Threading;
using System.Threading.Tasks;
using Application.Interface;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Application.Post
{
    public class Create
    {
        public class Command : IRequest
        {
            public IFormFile File { get; set; }
            public string Name { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;

            }
            public Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var PhotoUploadResult = _photoAccessor.AddPhoto(request.File);
                throw new System.NotImplementedException();
            }
        }

        //   public class Handler : IRequestHandler<Command>
        // {
        //     // private readonly IPhotoAccessor _photoAccessor;
        //     // public Handler(IPhotoAccessor photoAccessor)
        //     // {
        //     //     _photoAccessor = photoAccessor;

        //     // }
        //     public Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        //     {
        //         throw new System.NotImplementedException();
        //     }
        // }
    }
}