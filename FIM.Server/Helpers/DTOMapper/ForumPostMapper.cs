using FIM.Server.DTOs.Forum;
using FIM.Server.DTOs.PrintDtos;
using FIM.Server.Models;

namespace FIM.Server.Helpers.DTOMapper
{
    public static class ForumPostMapper
    {
        public static ForumPostDto ToForumPostDto(this ForumPost post)
        {
            return new ForumPostDto(post.Id, post.Title, post.UserId, post.Text, post.Subject, post.Tag, post.IsDeleted, post.CreatedAt, post.Username);
        }
    }
}
