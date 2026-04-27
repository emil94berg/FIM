using FIM.Server.Data;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

namespace FIM.Server.Services
{
    public class UserFavoriteFilamentService : IUserFavoriteFilamentService
    {
        private readonly ApplicationDbContext _dbContext;
        public UserFavoriteFilamentService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> AddUserFavoriteFilamentAsync(string userId, string filamentId)
        {
            int id = await _dbContext.PublicFilamentCatalogs.Where(x => x.Identifier == filamentId).Select(x => x.Id).SingleOrDefaultAsync();


            var exists = await _dbContext.UserFavoriteFilaments.AnyAsync(x => x.UserId == userId && x.FilamentId == id);

            if (exists && id != 0)
            {
                return false;
            }

            var favoriteFilament = new UserFavoriteFilament() { UserId = userId, FilamentId = id};

            await _dbContext.UserFavoriteFilaments.AddAsync(favoriteFilament);
            await _dbContext.SaveChangesAsync();

            return true;
        }
        public async Task<bool> DeleteUserFavoriteFilamentAsync(string userId, string filamentId)
        {
            int id = await _dbContext.PublicFilamentCatalogs.Where(x => x.Identifier == filamentId).Select(x => x.Id).SingleOrDefaultAsync();

            var exsist = await _dbContext.UserFavoriteFilaments.AnyAsync(x => x.UserId == userId && x.FilamentId == id);

            if (exsist && id != 0)
            {
                var deleteFilament = await _dbContext.UserFavoriteFilaments.Where(x => x.UserId == userId && x.FilamentId == id).SingleOrDefaultAsync();
                if (deleteFilament != null)
                {
                    _dbContext.UserFavoriteFilaments.Remove(deleteFilament);
                    await _dbContext.SaveChangesAsync();
                    return true;
                }
                else
                {
                    return false;
                }

            }
            else
            {
                return false;
            }
        }

    }
}
