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
                CreatedAt = DateTime.UtcNow,
                Username = createDto.Username
                
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
           
            var forumPostReturnList = new List<ForumPostDto>(); 

            var enumTypes = Enum.GetValues<ForumPostTags>();

            foreach(var type in enumTypes)
            {
                var newList = await _dbContext.ForumPosts
                    .Where(fp => fp.Tag == type)
                    .OrderByDescending(fp => fp.CreatedAt)
                    .Take(takePerTagNumber).ToListAsync();

                foreach(var obj in newList)
                {
                    forumPostReturnList.Add(obj.ToForumPostDto());
                }

            }

            return forumPostReturnList;
        }
        public async Task<List<ForumPostDto>> GetPostsOnTagsAsync(ForumPostTags tag)
        {
            var forumPosts = await _dbContext.ForumPosts.Where(fp => fp.Tag == tag).ToListAsync();
            if(forumPosts != null && forumPosts.Count != 0)
            {
                return forumPosts.ToListForumPostDto();
            }
            return new List<ForumPostDto>();
        }
        public async Task<PagedForumPostResult> GetPagedForumPostAsync(int pageNumber, int pageSize, bool isDescending, ForumPostTags tag)
        {
            var skip = (pageNumber -1) * pageSize;

            //var pageList = await _dbContext.ForumPosts
            //    .Where(fp => fp.Tag == tag)
            //    .OrderByDescending(fp => fp.CreatedAt)
            //    .Skip(skip)
            //    .Take(pageSize)
            //    .ToListAsync();

            var countList = await _dbContext.ForumPosts
                .Where(fp => fp.Tag == tag)
                .OrderByDescending(fp => fp.CreatedAt)
                .ToListAsync();

            var totalCount = countList.Count;

            var pageList = countList.Skip(skip)
                .Take(pageSize)
                .ToList();


            var result = new PagedForumPostResult
            {
                Items = pageList.ToListForumPostDto(),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            return result;
        }
    }
}
