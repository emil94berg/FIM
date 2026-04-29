using FIM.Server.DTOs.CommentDto;
using FIM.Server.Models;

namespace FIM.Server.Services.Interfaces
{
    public interface ICommentService
    {
        Task<List<CommentDto>> GetCommentsForPostAsync(int forumPostId);
        Task<CommentDto> CreateCommentAsync(CreateCommentDto createDto, string userId);
        Task<CommentDto> SoftDeleteCommentsAsync(int commentId, string userId);
        Task<int> HardDeleteCommentsAsync(int commentId, string userId);
    }
}
