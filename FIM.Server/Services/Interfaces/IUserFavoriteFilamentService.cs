using FIM.Server.Models;

namespace FIM.Server.Services.Interfaces
{
    public interface IUserFavoriteFilamentService
    {
        Task<bool> AddUserFavoriteFilamentAsync(string userId, string filamentId);
        Task<bool> DeleteUserFavoriteFilamentAsync(string userId, string filamentId);
    }
}
