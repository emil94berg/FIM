using FIM.Server.DTOs.Forum;
using FIM.Server.Models;

namespace FIM.Server.Services.Interfaces
{
    public interface IForumPostService
    {
        Task<List<ForumPost>> GetAllPostsAsync();
        Task<ForumPost> CreatePostAsync(string userId, CreateForumPostDto createDto);
    }
}
