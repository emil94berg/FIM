namespace FIM.Server.DTOs.Forum
{
    public class PagedForumPostResult
    {
        public List<ForumPostDto> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
