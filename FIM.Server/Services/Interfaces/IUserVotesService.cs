using FIM.Server.DTOs.UserVotesDtos;

namespace FIM.Server.Services.Interfaces
{
    public interface IUserVotesService
    {
        Task<List<UserVotesDto>> GetUserVotesFromPostIdAsync(int postId);
        Task<UserVotesDto> CreateUpVoteForPostAsync(CreateUserVotesDto createDto, string userId);
        Task<int> RemoveUpvoteForCommentAsync(CreateUserVotesDto dto, string userId);
    }
}
