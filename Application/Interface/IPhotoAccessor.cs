using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interface
{
    public interface IPhotoAccessor
    {
        PhotoUploadResult AddPhoto(IFormFile file);
        Task<string> DeletePhoto(string publicId);
    }
}