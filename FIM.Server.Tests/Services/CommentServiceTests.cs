using FIM.Server.DTOs.CommentDto;
using FIM.Server.DTOs.Forum;
using FIM.Server.Models;
using FIM.Server.Services;
using FIM.Server.Tests.TestInfrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIM.Server.Tests.Services
{
    public class CommentServiceTests : IClassFixture<SqliteInMemoryDbContextFactory>
    {

        [Fact]
        public async Task GetAllComments_ShouldReturnAllCommentsForASpecificPost()
        {
            //Arrange
            using var factory = new SqliteInMemoryDbContextFactory();
            await using var context = factory.CreateDbContext();
            var forumPostService = new ForumPostService(context);
            var commentService = new CommentService(context);
            
            var forumPost = new CreateForumPostDto("Title", "Content", "subject1", ForumPostTags.Help, "userName1");
            context.ForumPosts.Add(new ForumPost { 
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false,
                Subject = forumPost.Subject,
                Tag = forumPost.Tag,
                UserId = "user1",
                Title = forumPost.Title,
                Text = forumPost.Text,
                Username = forumPost.Username
            });
            await context.SaveChangesAsync();

            int forumPostId = context.ForumPosts.First().Id;

            var commentList = new List<Comment>()
            {
                 new Comment { ForumPostId = forumPostId, ParentId = null, Content = "Content", Username = "userName1", UserId = "user1" },
                 new Comment { ForumPostId = forumPostId, ParentId = forumPostId, Content = "Content2", Username = "userName1", UserId = "user1" },
                 new Comment { ForumPostId = forumPostId, ParentId = forumPostId, Content = "Content3", Username = "userName1", UserId = "user1" },
                 new Comment { ForumPostId = forumPostId, ParentId = forumPostId, Content = "Content4", Username = "userName1", UserId = "user1" }   
            };
            context.Comments.AddRange(commentList);
            await context.SaveChangesAsync();

            //Act
            var testList = await commentService.GetCommentsForPostAsync(forumPostId);

            //Assert
            Assert.NotNull(testList);
            Assert.Equal(4, testList.Count);
            Assert.Equal("Content", testList[0].Content);
            Assert.False(testList[0].IsDeleted);
        }

        [Fact]
        public async Task CreateComments()
        {
            //Arrange
            using var factory = new SqliteInMemoryDbContextFactory();
            await using var context = factory.CreateDbContext();
            var forumPostService = new ForumPostService(context);
            var commentService = new CommentService(context);

            var forumPost = new CreateForumPostDto("Title", "Content", "subject1", ForumPostTags.Help, "userName1");
            context.ForumPosts.Add(new ForumPost
            {
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false,
                Subject = forumPost.Subject,
                Tag = forumPost.Tag,
                UserId = "user1",
                Title = forumPost.Title,
                Text = forumPost.Text,
                Username = forumPost.Username
            });
            await context.SaveChangesAsync();

            int forumPostId = context.ForumPosts.First().Id;
            //Act
            var saveComment = new CreateCommentDto(forumPostId, null, "Content", "userName1");
            var commentFromDb = await commentService.CreateCommentAsync(saveComment, "user1");

            //Assert
            Assert.NotNull(commentFromDb);
            Assert.Equal("Content", commentFromDb.Content);
            Assert.False(commentFromDb.IsDeleted);
        }

        public async Task<int> CreateTestComments_AndReturnForumPostId(CommentService commentService, ForumPostService forumPostService)
        {
            string userId = "user1";

            var forumPost = new CreateForumPostDto("Title", "Content", "subject1", ForumPostTags.Help, "userName1");
            await forumPostService.CreatePostAsync(userId, forumPost);
            var forumPosts = await forumPostService.GetAllPostsAsync();
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
                await commentService.CreateCommentAsync(comment,userId);
            }
            return forumPostId;
        }
    }
}
