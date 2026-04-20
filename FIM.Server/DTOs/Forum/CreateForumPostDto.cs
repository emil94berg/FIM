using FIM.Server.Models;

namespace FIM.Server.DTOs.Forum
{
        public record CreateForumPostDto(
        string Title,
        string Text,
        string Subject,
        ForumPostTags Tag
    );
}
