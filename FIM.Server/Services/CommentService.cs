using FIM.Server.Data;
using FIM.Server.DTOs.CommentDto;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FIM.Server.Services
{
    public class CommentService : ICommentService
    {
        private readonly ApplicationDbContext _dbContext;
        public CommentService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<CommentDto>> GetCommentsForPostAsync(int forumPostId)
        {
            var comments = await _dbContext.Comments
                .Where(c => c.ForumPostId == forumPostId)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            if (comments != null) return comments.ToCommentDtoList();
            return new List<CommentDto>();
        }
        public async Task<CommentDto> CreateCommentAsync(CreateCommentDto createDto)
        {
            var newComment = new Comment
            {
                ForumPostId = createDto.ForumPostId,
                ParentId = createDto.ParentId,
                UserId = createDto.UserId,
                Content = createDto.Content,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false,
                UpVotes = 0
            };
            _dbContext.Add(newComment);
            await _dbContext.SaveChangesAsync();
            return newComment.ToCommentDto();
        }

    }

}
