using FIM.Server.Data;
using FIM.Server.DTOs.Forum;
using FIM.Server.Helpers.DTOMapper;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
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
        public async Task<ForumPostDto> CreatePostAsync(string userId, CreateForumPostDto createDto)
        {
            var newPost = new ForumPost
            {
                UserId = userId,
                Title = createDto.Title,
                IsDeleted = false,
                Subject = createDto.Subject,
                Tag = createDto.Tag,
                Text = createDto.Text,
                CreatedAt = DateTime.UtcNow
            };
            _dbContext.ForumPosts.Add(newPost);
            await _dbContext.SaveChangesAsync();
            return newPost.ToForumPostDto();
        }
        public async Task<bool> DeletePostAsync(int id)
        {
            var deletePost = await _dbContext.ForumPosts.FirstOrDefaultAsync(p => p.Id == id);
            if (deletePost != null)
            {
                _dbContext.Remove(deletePost);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<ForumPostDto> GetSpecifikPostAsync(int id)
        {
            var post = await _dbContext.ForumPosts.FirstOrDefaultAsync(p => p.Id == id);
            if (post != null) return post.ToForumPostDto();
            else return null;
        }

        public async Task<List<ForumPostDto>> GetLatestPostsAsync(int takePerTagNumber)
        {
            //var amaList = await _dbContext.ForumPosts
            //    .Where(fp => fp.Tag == ForumPostTags.AMA)
            //    .OrderBy(fp => fp.CreatedAt)
            //    .Take(5).ToListAsync();

            //var helpList = await _dbContext.ForumPosts
            //    .Where(fp => fp.Tag == ForumPostTags.Help)
            //    .OrderBy(fp => fp.CreatedAt)
            //    .Take(5).ToListAsync();

            //var questionList = await _dbContext.ForumPosts
            //    .Where(fp => fp.Tag == ForumPostTags.Question)
            //    .OrderBy(fp => fp.CreatedAt)
            //    .Take(5).ToListAsync();

            //var discussionList = await _dbContext.ForumPosts
            //    .Where(fp => fp.Tag == ForumPostTags.Discussion)
            //    .OrderBy(fp => fp.CreatedAt)
            //    .Take(5).ToListAsync();

            //var showcaseList = await _dbContext.ForumPosts
            //    .Where(fp => fp.Tag == ForumPostTags.Showcase)
            //    .OrderBy(fp => fp.CreatedAt)
            //    .Take(5).ToListAsync();


            var forumPostReturnList = new List<ForumPostDto>(); 

            var enumTypes = Enum.GetValues<ForumPostTags>();

            foreach(var type in enumTypes)
            {
                var newList = await _dbContext.ForumPosts
                    .Where(fp => fp.Tag == type)
                    .OrderBy(fp => fp.CreatedAt)
                    .Take(takePerTagNumber).ToListAsync();

                foreach(var obj in newList)
                {
                    forumPostReturnList.Add(obj.ToForumPostDto());
                }

            }

            return forumPostReturnList;
        }
    }
}
