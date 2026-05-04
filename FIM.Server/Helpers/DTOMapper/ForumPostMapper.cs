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
        public static List<ForumPostDto> ToListForumPostDto(this List<ForumPost> posts)
        {
            List<ForumPostDto> dtoList = new();
            foreach(var p in posts)
            {
                dtoList.Add(new ForumPostDto(p.Id, p.Title, p.UserId, p.Text, p.Subject, p.Tag, p.IsDeleted, p.CreatedAt, p.Username));
            }
            return dtoList;
        }

    }
}
