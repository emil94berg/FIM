using FIM.Server.DTOs.CommentDto;
using FIM.Server.DTOs.Forum;
using FIM.Server.Models;
using FIM.Server.Services;
using FIM.Server.Tests.TestInfrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIM.Server.Tests.Services
{
    public class CommentServiceTests : IClassFixture<SqliteInMemoryDbContextFactory>
    {
        private readonly CommentService _commentService;
        private readonly ForumPostService _forumPostService;

        public CommentServiceTests(SqliteInMemoryDbContextFactory dbContextFactory)
        {
            var _dbContext = dbContextFactory.CreateDbContext();
            _commentService = new CommentService(_dbContext);
            _forumPostService = new ForumPostService(_dbContext);
        }

        [Fact]
        public async Task GetAllComments_ShouldReturnAllCommentsForASpecifikPost()
        {
            //Arrange
            int forumPostId = await CreateTestComments_AndReturnForumPostId();

            //Act
            var commentsList = await _commentService.GetCommentsForPostAsync(forumPostId);

            //Assert
            Assert.NotNull(commentsList);
            Assert.Equal(4, commentsList.Count);
            Assert.Equal("Content", commentsList[0].Content);
            Assert.False(commentsList[0].IsDeleted);
        }

        [Fact]
        public async Task CreateComments()
        {
            //Arrange
            int forumPostId = await CreateTestComments_AndReturnForumPostId();
            //Act
            var commentsList = await _commentService.GetCommentsForPostAsync(forumPostId);
            //Assert
            Assert.NotNull(commentsList);
            Assert.Equal("Content", commentsList[0].Content);
            Assert.False(commentsList[0].IsDeleted);
        }

        public async Task<int> CreateTestComments_AndReturnForumPostId()
        {
            string userId = "user1";

            var forumPost = new CreateForumPostDto("Title", "Content", "subject1", ForumPostTags.Help, "userName1");
            await _forumPostService.CreatePostAsync(userId, forumPost);
            var forumPosts = await _forumPostService.GetAllPostsAsync();
            int forumPostId = forumPosts.First().Id;

            var commentList = new List<CreateCommentDto>()
            {
                 new CreateCommentDto(forumPostId,null,"Content","userName1"),
                 new CreateCommentDto(forumPostId,1,"Content2","userName1"),
                 new CreateCommentDto(forumPostId,1,"Content3","userName1"),
                 new CreateCommentDto(forumPostId,1,"Content4","userName1")
                
            };
            foreach (var comment in commentList)
            {
                await _commentService.CreateCommentAsync(comment,userId);
            }
            return forumPostId;
        }
    }
}
