using FIM.Server.Models;

namespace FIM.Server.DTOs.CommentDto
{
    public record CommentDto(
        int Id,
        int ForumPostId,
        int? ParentId,
        string UserId,
        string Content,
        DateTime CreatedAt,
        bool IsDeleted,
        int UpVotes,
        string Username
        );

    public record CreateCommentDto(
        int ForumPostId,
        int? ParentId,
        string Content,
        string Username
        );

    public static class CommentDtoExtensions
    {
        public static CommentDto ToCommentDto(this Comment comment)
        {
            return new CommentDto(
                comment.Id,
                comment.ForumPostId,
                comment.ParentId,
                comment.UserId,
                comment.Content,
                comment.CreatedAt,
                comment.IsDeleted,
                comment.UpVotes,
                comment.Username
            );
        }
        
        public static List<CommentDto> ToCommentDtoList(this List<Comment> comments)
        {
            return comments.Select(c => c.ToCommentDto()).ToList();
        }
    }
}
