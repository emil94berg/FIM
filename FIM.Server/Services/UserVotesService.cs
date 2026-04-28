using FIM.Server.Data;
using FIM.Server.DTOs.UserVotesDtos;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FIM.Server.Services
{
    public class UserVotesService : IUserVotesService
    {
        private readonly ApplicationDbContext _dbContext;

        public UserVotesService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<UserVotesDto>> GetUserVotesFromPostIdAsync(int postId)
        {
            var allUserVotes = await _dbContext.UserVotes.Where(uv => uv.PostId == postId).ToListAsync();
            if(allUserVotes != null)
            {
                return allUserVotes.ToUserVotesDtoList();
            }
            return new List<UserVotesDto>();
        }
        public async Task<UserVotesDto> CreateUpVoteForPostAsync(CreateUserVotesDto createDto, string userId)
        {
            var userVote = new UserVotes{
                UserId = userId,
                CommentId = createDto.commentId,
                PostId = createDto.postId
            };
            var alreadyVoted = await _dbContext.UserVotes.AnyAsync(v => v.UserId == userId &&
            v.CommentId == createDto.commentId &&
            v.PostId == createDto.postId);

            if(alreadyVoted)
            {
                return null;
            }
            else
            {
                _dbContext.UserVotes.Add(userVote);
                var comment = _dbContext.Comments.Where(c => c.Id == createDto.commentId).FirstOrDefault();
                if (comment != null)
                {
                    comment.UpVotes += 1;
                }
                await _dbContext.SaveChangesAsync();
                return userVote.ToUserVotesDto();
            }
        }
        public async Task<int> RemoveUpvoteForCommentAsync(CreateUserVotesDto dto, string userId)
        {
            var deleteVote = await _dbContext.UserVotes.Where(v =>
            v.UserId == userId && 
            v.PostId == dto.postId &&
            v.CommentId == dto.commentId)
                .FirstOrDefaultAsync();

            if(deleteVote != null)
            {
                int returnInt = deleteVote.Id;
                _dbContext.UserVotes.Remove(deleteVote);
                var comment = _dbContext.Comments.Where(c => c.Id == dto.commentId).FirstOrDefault();
                if (comment != null)
                {
                    comment.UpVotes -= 1;
                }
                await _dbContext.SaveChangesAsync();
                return returnInt;
            }
            else
            {
                return 0;
            }
        }
        
    }
}
