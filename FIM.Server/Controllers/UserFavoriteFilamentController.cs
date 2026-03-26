using Microsoft.AspNetCore.Mvc;
using FIM.Server.DTOs.SpoolDtos;
using FIM.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using FIM.Server.Models;

namespace FIM.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserFavoriteFilamentController : ControllerBase
    {
        private string UserId => User.FindFirst("sub")!.Value;

        private readonly IUserFavoriteFilamentService _userFavoriteFilamentService;
        public UserFavoriteFilamentController(IUserFavoriteFilamentService userFavoriteFilamentService)
        {
            _userFavoriteFilamentService = userFavoriteFilamentService;
        }

        [HttpPost("SetFavorite/{filamentId}")]
        public async Task<IActionResult> AddFavoriteAsync(string filamentId)
        {
            var result = await _userFavoriteFilamentService.AddUserFavoriteFilamentAsync(UserId, filamentId);
            if (result) return Ok();
            else return BadRequest();
        }
        [HttpPost]
        public async Task<IActionResult> DeleteFavoriteAsync(string filamentId)
        {
            var result = await _userFavoriteFilamentService.DeleteUserFavoriteFilamentAsync(UserId, filamentId);
            if (result) return Ok();
            else return BadRequest();

        }
    }
}
