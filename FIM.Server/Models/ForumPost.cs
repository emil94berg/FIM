namespace FIM.Server.Models
{
    public class ForumPost
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string UserId { get; set; }
        public string Text { get; set; }
        public string Subject { get; set; }
        public ForumPostTags Tag { get; set; }
        public bool IsDeleted { get; set; } = false;

    }
}
