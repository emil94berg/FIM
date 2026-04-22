using FIM.Server.Models;

namespace FIM.Server.DTOs.Forum
{
    public record ForumPostDto
    (
        int Id,
        string Title,
        string UserId,
        string Text,
        string Subject,
        ForumPostTags Tag,
        bool IsDeleted,
        DateTime CreatedAt,
        string Username
    );
}
