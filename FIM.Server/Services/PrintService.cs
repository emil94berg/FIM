using FIM.Server.Data;
using Microsoft.EntityFrameworkCore;
using FIM.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.HttpResults;
using FIM.Server.Services.Interfaces;

namespace FIM.Server.Services
{
    public class PrintService : IPrintService
    {
        private readonly ApplicationDbContext _context;
        public PrintService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Print>> GetAllPrintsAsync()
        {
            return await _context.Prints.Include(p => p.Spool).ToListAsync();
        }
        public async Task<Print> CreatePrintAsync(Print print)
        {
            await _context.Prints.AddAsync(print);
            await _context.SaveChangesAsync();

            return await _context.Prints.Include(p => p.Spool).FirstAsync(p => p.Id == print.Id);
        }

        public async Task<bool> DeletePrintAsync(int id)
        {
            var delete = await _context.Prints.Where(p => p.Id == id).FirstOrDefaultAsync();
            if(delete != null)
            {
                _context.Prints.Remove(delete);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<Print?> UpdatePrintAsync(int id, Print updatedPrint)
        {
            var update = await _context.Prints.Include(p => p.Spool).FirstOrDefaultAsync(p => p.Id == id);
            if(update != null)
            {
                update.Name = updatedPrint.Name;
                update.GramsUsed = updatedPrint.GramsUsed;
                update.Status = updatedPrint.Status;
                update.SpoolId = updatedPrint.SpoolId;

                await _context.SaveChangesAsync();
                return await _context.Prints.Include(p => p.Spool).FirstAsync(p => p.Id == id);
            }
            else
            {
                return null;
            }
        }

    }
}
