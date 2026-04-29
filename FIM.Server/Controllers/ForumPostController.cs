using FIM.Server.DTOs.Forum;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FIM.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ForumPostController : ControllerBase
    {
        private readonly IForumPostService _forumPostService;
        public ForumPostController(IForumPostService forumPostService)
        {
            _forumPostService = forumPostService;
        }
        private string UserId => User.FindFirst("sub")!.Value;
        [HttpGet]
        public async Task<IActionResult> GetAllPost()
        {
            var result = await _forumPostService.GetAllPostsAsync();
            if (result != null) return Ok(result);
            else return BadRequest();
        }
        [HttpPost("CreateForumPost")]
        public async Task<IActionResult> CreatePost([FromBody] CreateForumPostDto createDto)
        {
            var result = await _forumPostService.CreatePostAsync(UserId, createDto);
            if (result != null) return Ok(result);
            else return BadRequest();
        }
        [HttpDelete("DeleteForumPost")]
        public async Task<IActionResult> DeletePostAsync([FromBody] ForumPostDto deleteDto)
        {
            var result = await _forumPostService.DeletePostAsync(deleteDto.Id);
            if (result) return Ok();
            else return BadRequest();
        }
        [HttpGet("GetAllTags")]
        public async Task<string[]> GetAllTasksAsync()
        {
            var result = Enum.GetNames(typeof(ForumPostTags));
            return result;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSpecifikPostAsync(int id)
        {
            var result = await _forumPostService.GetSpecifikPostAsync(id);
            if (result != null) return Ok(result);
            else return NotFound();

        }
        [HttpGet("GetLatestPosts")]
        public async Task<IActionResult> GetLatestPostsAsync()
        {
            var result = await _forumPostService.GetLatestPostsAsync(5);
            if (result != null) return Ok(result);
            else return NotFound();
        }
        [HttpGet("GetLatestForumPosts")]
        public async Task<IActionResult> GetLatestForumPostsAsync()
        {
            var result = await _forumPostService.GetNewestForumPostsAsync(20);
            if (result != null) return Ok(result);
            else return NotFound();
        }
        [HttpGet("GetActiveForumPosts")]
        public async Task<IActionResult> GetActivePostsAsync()
        {
            var result = await _forumPostService.GetForumPostBasedOnActivity(20);
            if (result != null) return Ok(result);
            else return NotFound();
        }
    }
}

