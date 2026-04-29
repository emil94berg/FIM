using FIM.Server.DTOs.Forum;
using FIM.Server.Services;
using FIM.Server.Tests.TestInfrastructure;
using Microsoft.SqlServer.Server;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIM.Server.Tests.Services
{
    public class ForumPostServiceTests : IClassFixture<SqliteInMemoryDbContextFactory>
    {
        private readonly ForumPostService _forumPostService;
        public ForumPostServiceTests(SqliteInMemoryDbContextFactory dbContextFactory)
        {
             var _dbContext = dbContextFactory.CreateDbContext();
            _forumPostService = new ForumPostService(_dbContext);
        }

        [Fact]
        public async Task GetAllPostsAsync_ReturnsAllNonDeletedPosts()
        {
            // Arrange
            await CreatePosts();

            // Act
            var allPosts = await _forumPostService.GetAllPostsAsync();
            int zeroPosts = 0;
            // Assert
            Assert.NotNull(allPosts);
            Assert.NotEqual(zeroPosts, allPosts.Count);
        }

        [Fact]
        public async Task CreatePosts_ShouldCreatePostsSuccessfully()
        {
            //Arrange
            var userId = "testuser-1";

            var postList = await CreatePosts();

            var createDto = postList[0];
            var createDto2 = postList[1];
            var createDto3 = postList[2];
            var createDto4 = postList[3];

            //Act
            var createdPost = await _forumPostService.CreatePostAsync(userId, createDto);
            var createdPost2 = await _forumPostService.CreatePostAsync(userId, createDto2);
            var createdPost3 = await _forumPostService.CreatePostAsync(userId, createDto3);
            var createdPost4 = await _forumPostService.CreatePostAsync("testuser-2", createDto4);

            //Assert
            Assert.NotNull(createdPost);
            Assert.NotNull(createdPost2);
            Assert.NotNull(createdPost3);
            Assert.NotNull(createdPost4);
            Assert.NotEqual(createdPost.Id, createdPost2.Id);
            Assert.NotEqual(createdPost.Id, createdPost3.Id);
            Assert.NotEqual(createdPost.Id, createdPost4.Id);
            Assert.NotEqual(createdPost.UserId, createdPost4.UserId);
            Assert.False(createdPost.IsDeleted);
            Assert.False(createdPost2.IsDeleted);
            Assert.False(createdPost3.IsDeleted);
            Assert.False(createdPost4.IsDeleted);
        }
        [Fact]
        public async Task DeletePostAsync_ShouldDeletePostSuccessfully_SpecifikPostShouldReturnNull()
        {
            //Arrange
            var userId = "testuser-1";
            var postList = await CreatePosts();
            var createDto = postList[0];
            var createdPost = await _forumPostService.CreatePostAsync(userId, createDto);
            //Act
            var deleteResult = await _forumPostService.DeletePostAsync(createdPost.Id);
            var deletedPost = await _forumPostService.GetSpecifikPostAsync(createdPost.Id);
            //Assert
            Assert.True(deleteResult);
            Assert.Null(deletedPost);
        }

        [Fact]
        public async Task GetLatestPost_ShouldReturnNewestPostForEachEnumTag()
        {
            //Arrange
            var userId = "testuser-1";
            var postList = await CreatePosts();

            foreach (var post in postList)
            {
                await _forumPostService.CreatePostAsync(userId, post);
            }

            //Act
            var latestPosts = await _forumPostService.GetLatestPostsAsync(3);
            var amaPosts = latestPosts.Where(p => p.Tag == Models.ForumPostTags.AMA).ToList();
            var discussionPosts = latestPosts.Where(p => p.Tag == Models.ForumPostTags.Discussion).ToList();

            //Assert
            Assert.NotNull(latestPosts);
            Assert.Equal(3, amaPosts.Count);
            Assert.Single(discussionPosts);
        }

        public async Task<List<CreateForumPostDto>> CreatePosts()
        {
            var returnList = new List<CreateForumPostDto>();
            var createDto = new CreateForumPostDto
            (
                    "Title 1",
                    "This is the text of the first post1.",
                    "Subject 1",
                    Models.ForumPostTags.AMA,
                    "testuser1"
            );
            var createDto2 = new CreateForumPostDto
            (
                    "Title 2",
                    "This is the text of the first post2.",
                    "Subject 2",
                    Models.ForumPostTags.Question,
                    "testuser1"
            );
            var createDto3 = new CreateForumPostDto
            (
                    "Title 3",
                    "This is the text of the first post3.",
                    "Subject 3",
                    Models.ForumPostTags.Discussion,
                    "testuser1"
            );
            var createDto4 = new CreateForumPostDto
            (
                    "Title 4",
                    "This is the text of the first post4.",
                    "Subject 4",
                    Models.ForumPostTags.Help,
                    "testuser2"
            );
            var createDto5 = new CreateForumPostDto
            (
                    "Title 5",
                    "This is the text of the first post5.",
                    "Subject 5",
                    Models.ForumPostTags.AMA,
                    "testuser1"
            );
            var createDto6 = new CreateForumPostDto
            (
                    "Title 6",
                    "This is the text of the first post6.",
                    "Subject 6",
                    Models.ForumPostTags.AMA,
                    "testuser1"
            );
            returnList.Add( createDto );
            returnList.Add( createDto2 );
            returnList.Add( createDto3 );
            returnList.Add( createDto4 );
            returnList.Add( createDto5 );
            returnList.Add( createDto6 );

            return returnList;
        }
    }
}
