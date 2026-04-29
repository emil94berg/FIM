using FIM.Server.Data;
using FIM.Server.DTOs.CommentDto;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

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
        public async Task<CommentDto> CreateCommentAsync(CreateCommentDto createDto, string userId)
        {
            var newComment = new Comment
            {
                ForumPostId = createDto.ForumPostId,
                ParentId = createDto.ParentId,
                UserId = userId,
                Content = createDto.Content,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false,
                UpVotes = 0,
                Username = createDto.Username
            };
            _dbContext.Add(newComment);
            await _dbContext.SaveChangesAsync();
            return newComment.ToCommentDto();
        }
        public async Task<CommentDto> SoftDeleteCommentsAsync(int commentId, string userId)
        {
            var commentToDelete = await _dbContext.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.UserId == userId);
            if (commentToDelete != null)
            {
                commentToDelete.IsDeleted = true;
                _dbContext.Update(commentToDelete);
                await _dbContext.SaveChangesAsync();
                return commentToDelete.ToCommentDto();
            }
            else return null;
        } 
        public async Task<int> HardDeleteCommentsAsync(int commentId, string userId)
        {
            var commentToDelete = await _dbContext.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.UserId == userId);
            if (commentToDelete != null)
            {
                _dbContext.Remove(commentToDelete);
                await _dbContext.SaveChangesAsync();
                return commentToDelete.Id;
            }
            else return 0;
        }
    }
}
