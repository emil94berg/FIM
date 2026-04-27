using FIM.Server.DTOs.UserVotesDtos;

namespace FIM.Server.Services.Interfaces
{
    public interface IUserVotesService
    {
        Task<List<UserVotesDto>> GetUserVotesFromPostIdAsync(int postId);
        Task<bool> CreateUpVoteForPostAsync(CreateUserVotesDto createDto, string userId);
    }
}
