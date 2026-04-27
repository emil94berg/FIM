using FIM.Server.DTOs.UserVotesDtos;
using FIM.Server.Migrations;
using FIM.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace FIM.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserVotesController : ControllerBase
    {
        private readonly IUserVotesService _userVotesService;
        public UserVotesController(IUserVotesService userVotesService)
        {
            _userVotesService = userVotesService;
        }
        private string UserId => User.FindFirst("sub")!.Value;

        [HttpGet("{postId}")]
        public async Task<IActionResult> GetAllLikesForPostAsync(int postId)
        {
            var result = await _userVotesService.GetUserVotesFromPostIdAsync(postId);
            if (result != null)
            {
                return Ok(result);
            }
            return BadRequest();
        }
        [HttpPost("CreateVoteForUserOnPost")]
        public async Task<IActionResult> CreateUpvote([FromBody] CreateUserVotesDto createDto)
        {
            var result = await _userVotesService.CreateUpVoteForPostAsync(createDto, UserId);
            if(result != null)
            {
                return Ok(result);
            }
            return BadRequest();
        }
        [HttpDelete("CreateDownVoteForUserPost")]
        public async Task<IActionResult> CreateDownVote([FromBody] UserVotesDto dto)
        {
            var result = await _userVotesService.RemoveUpvoteForCommentAsync(dto, UserId);
            if (result) return Ok(true);
            return BadRequest(false);
        }
        [HttpGet]
        public async Task <UserVotesDto> GetSchema()
        {
            return new UserVotesDto(1, "test", 1, 1);
        }
    }
}
