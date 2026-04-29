using FIM.Server.DTOs.Forum;
using FIM.Server.Services;
using FIM.Server.Tests.TestInfrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.SqlServer.Server;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIM.Server.Tests.Services
{
    public class ForumPostServiceTests : IClassFixture<SqliteInMemoryDbContextFactory>
    {
        [Fact]
        public async Task GetAllPostsAsync_ReturnsAllNonDeletedPosts()
        {

            // Arrange
            using var factory = new SqliteInMemoryDbContextFactory();
            await using var context = factory.CreateDbContext();
            var forumPostService = new ForumPostService(context);

            var postList = await ListOfMemoryPosts();
            
            context.ForumPosts.AddRange(postList.Select(dto => new Models.ForumPost
            {
                Title = dto.Title,
                Text = dto.Text,
                Subject = dto.Subject,
                Tag = dto.Tag,
                UserId = "test-user-1",
                IsDeleted = false,
                Username="testUserName"
            }));
            await context.SaveChangesAsync();
            // Act
            var allPosts = await forumPostService.GetAllPostsAsync();
            int zeroPosts = 0;
            // Assert
            Assert.NotNull(allPosts);
            Assert.NotEqual(zeroPosts, allPosts.Count);
            Assert.False(allPosts[0].IsDeleted);

        }

        [Fact]
        public async Task CreatePosts_ShouldCreatePostsSuccessfully()
        {
            //Arrange
            using var factory = new SqliteInMemoryDbContextFactory();
            await using var context = factory.CreateDbContext();
            var forumPostService = new ForumPostService(context);

            var userId = "testuser-1";

            var postList = await ListOfMemoryPosts();

            //Act
            var testList = new List<ForumPostDto>();
            foreach (var post in postList)
            {
                testList.Add(await forumPostService.CreatePostAsync(userId, post));
            }

            //Assert
            Assert.NotNull(testList);
            Assert.NotNull(testList[1]);
            Assert.NotNull(testList[2]);
            Assert.NotNull(testList[3]);
            Assert.NotEqual(testList[0].Id, testList[1].Id);
            Assert.NotEqual(testList[0].Id, testList[2].Id);
            Assert.NotEqual(testList[0].Id, testList[3].Id);
            Assert.False(testList[0].IsDeleted);
            Assert.False(testList[1].IsDeleted);
            Assert.False(testList[2].IsDeleted);
            Assert.False(testList[3].IsDeleted);
        }

        [Fact]
        public async Task DeletePostAsync_ShouldDeletePostSuccessfully_SpecifikPostShouldReturnNull()
        {
            //Arrange
            using var factory = new SqliteInMemoryDbContextFactory();
            await using var context = factory.CreateDbContext();
            var forumPostService = new ForumPostService(context);

            var userId = "testuser-1";
            var postList = await ListOfMemoryPosts();
            context.ForumPosts.AddRange(postList.Select(dto => new Models.ForumPost
            {
                Title = dto.Title,
                Text = dto.Text,
                Subject = dto.Subject,
                Tag = dto.Tag,
                UserId = "test-user-1",
                IsDeleted = false,
                Username = "testUserName"
            }));
            await context.SaveChangesAsync();
            //Act
            int allPostsCount = context.ForumPosts.Count();
            var deleteResult = await forumPostService.DeletePostAsync(context.ForumPosts.First().Id);
            //Assert
            Assert.True(deleteResult);
            Assert.NotEqual(allPostsCount, context.ForumPosts.Count());
        }

        [Fact]
        public async Task GetLatestPost_ShouldReturnNewestPostForEachEnumTag()
        {
            //Arrange
            using var factory = new SqliteInMemoryDbContextFactory();
            await using var context = factory.CreateDbContext();
            var forumPostService = new ForumPostService(context);

            var userId = "testuser-1";

            var postList = await ListOfMemoryPosts();
            context.ForumPosts.AddRange(postList.Select(dto => new Models.ForumPost
            {
                Title = dto.Title,
                Text = dto.Text,
                Subject = dto.Subject,
                Tag = dto.Tag,
                UserId = "test-user-1",
                IsDeleted = false,
                Username = "testUserName"
            }));
            await context.SaveChangesAsync();

            //Act
            var latestPosts = await forumPostService.GetLatestPostsAsync(3);
            var amaPosts = latestPosts.Where(p => p.Tag == Models.ForumPostTags.AMA).ToList();
            var discussionPosts = latestPosts.Where(p => p.Tag == Models.ForumPostTags.Discussion).ToList();

            //Assert
            Assert.NotNull(latestPosts);
            Assert.Equal(3, amaPosts.Count);
            Assert.Single(discussionPosts);
        }

        public async Task<List<CreateForumPostDto>> ListOfMemoryPosts()
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
