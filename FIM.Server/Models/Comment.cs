namespace FIM.Server.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int ForumPostId { get; set; }
        public int? ParentId { get; set; }
        public string UserId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
        public int UpVotes { get; set; }
        public string Username { get; set; }
    }
}
