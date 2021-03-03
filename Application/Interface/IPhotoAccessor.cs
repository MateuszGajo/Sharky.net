using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interface
{
    public interface IPhotoAccessor
    {
        PhotoUploadResult AddPhoto(IFormFile file); 
    }
}