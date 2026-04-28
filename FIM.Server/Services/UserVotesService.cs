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
        public async Task<UserVotesDto?> CreateUpVoteForPostAsync(CreateUserVotesDto createDto, string userId)
        {
            var userVote = new UserVotes{
                UserId = userId,
                CommentId = createDto.commentId,
                PostId = createDto.postId
            };

            _dbContext.UserVotes.Add(userVote);

            var comment = await _dbContext.Comments
                .FirstOrDefaultAsync(c => c.Id == createDto.commentId);

            if(comment != null)
            {
                comment.UpVotes += 1;
            }

            try
            {
                await _dbContext.SaveChangesAsync();
                return userVote.ToUserVotesDto();
            }
            catch
            {
                return null;
            }


            //var alreadyVoted = await _dbContext.UserVotes.AnyAsync(v => v.UserId == userId &&
            //v.CommentId == createDto.commentId &&
            //v.PostId == createDto.postId);

            //if(alreadyVoted)
            //{
            //    return null;
            //}
            //else
            //{
            //    _dbContext.UserVotes.Add(userVote);
            //    var comment = _dbContext.Comments.Where(c => c.Id == createDto.commentId).FirstOrDefault();
            //    if (comment != null)
            //    {
            //        comment.UpVotes += 1;
            //    }
            //    await _dbContext.SaveChangesAsync();
            //    return userVote.ToUserVotesDto();
            //}
        }
        public async Task<int> RemoveUpvoteForCommentAsync(CreateUserVotesDto dto, string userId)
        {
            var deletedVote = await _dbContext.UserVotes.Where(v =>
            v.UserId == userId && 
            v.PostId == dto.postId &&
            v.CommentId == dto.commentId)
                .FirstOrDefaultAsync();

            if(deletedVote == null)
            {
                return 0;
            }

            int returnInt = deletedVote.Id;
            _dbContext.UserVotes.Remove(deletedVote);

            try
            {
                await _dbContext.SaveChangesAsync();
                var comment = await _dbContext.Comments.FirstOrDefaultAsync(c => c.Id == dto.commentId);
                if (comment != null)
                {
                    comment.UpVotes += 1;
                    await _dbContext.SaveChangesAsync();
                }
                return returnInt;
            }
            catch (DbUpdateConcurrencyException)
            {
                return 0;
            }

            //if(deleteVote != null)
            //{
            //    int returnInt = deleteVote.Id;
            //    _dbContext.UserVotes.Remove(deleteVote);
            //    var comment = _dbContext.Comments.Where(c => c.Id == dto.commentId).FirstOrDefault();
            //    if (comment != null)
            //    {
            //        comment.UpVotes -= 1;
            //    }
            //    await _dbContext.SaveChangesAsync();
            //    return returnInt;
            //}
            //else
            //{
            //    return 0;
            //}
        }
        
    }
}
