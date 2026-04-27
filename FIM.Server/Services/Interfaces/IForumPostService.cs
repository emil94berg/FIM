using FIM.Server.DTOs.Forum;
using FIM.Server.Models;

namespace FIM.Server.Services.Interfaces
{
    public interface IForumPostService
    {
        Task<List<ForumPost>> GetAllPostsAsync();
        Task<ForumPostDto> CreatePostAsync(string userId, CreateForumPostDto createDto);
        Task<bool> DeletePostAsync(int id);
        Task<ForumPostDto> GetSpecifikPostAsync(int id);
        Task<List<ForumPostDto>> GetLatestPostsAsync(int takePerTagNumber);
    }
}
