using FIM.Server.DTOs.CommentDto;
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
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }
        private string UserId => User.FindFirst("sub")!.Value;

        [HttpGet("{postId}")]
        public async Task<IActionResult> GetCommentsForPostAsync(int postId)
        {
            var result = await _commentService.GetCommentsForPostAsync(postId);
            if(result != null) return Ok(result);
            return BadRequest();
        }
        [HttpPost("CreateComment")]
        public async Task<IActionResult> CreateCommentAsync([FromBody] CreateCommentDto createDto)
        {
            var result = await _commentService.CreateCommentAsync(createDto);
            if (result != null) return Ok(result);
            return BadRequest();
        }

        [HttpGet]
        public async Task<CommentDto> GetSchema()
        {
            var date = DateTime.UtcNow;
            return new CommentDto(1, 1, 1, "hej", "hej", date, false, 1);
        }

    }
}
