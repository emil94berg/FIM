using FIM.Server.Data;
using FIM.Server.DTOs.Forum;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FIM.Server.Services
{
    public class ForumPostService : IForumPostService
    {
        private readonly ApplicationDbContext _dbContext;
        public ForumPostService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<List<ForumPost>> GetAllPostsAsync()
        {
            var allPostsList = await _dbContext.ForumPosts.Where(p => !p.IsDeleted).ToListAsync();
            return allPostsList;
        }
        public async Task<ForumPost> CreatePostAsync(string userId, CreateForumPostDto createDto)
        {
            var newPost = new ForumPost
            {
                UserId = userId,
                Title = createDto.Title,
                IsDeleted = false,
                Subject = createDto.Subject,
                Tag = createDto.Tag,
                Text = createDto.Text
            };
            _dbContext.ForumPosts.Add(newPost);
            await _dbContext.SaveChangesAsync();
            return newPost;
        }
    }
}
