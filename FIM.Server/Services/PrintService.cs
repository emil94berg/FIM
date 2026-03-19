using FIM.Server.Data;
using FIM.Server.DTOs.PrintDtos;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;

namespace FIM.Server.Services
{
    public class PrintService : IPrintService
    {
        private readonly ApplicationDbContext _context;
        public PrintService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PrintDto>> GetAllPrintsAsync(string userId)
        {
            var dtoList = new List<PrintDto>();
            var print = await _context.Prints.Include(p => p.Spool).Where(u => u.UserId == userId).ToListAsync();
            foreach(var p in print){
                var dto = new PrintDto(
                        p.Id,
                        p.Name,
                        p.SpoolId,
                        p.GramsUsed,
                        p.Status,
                        p.CreatedAt,
                        p.Spool
                    );
                dtoList.Add(dto);
            }
            return dtoList;
        }
        public async Task<PrintDto> CreatePrintAsync(CreatePrintDto createPrintDto, string userId)
        {
            var print = new Print()
            {
                Name = createPrintDto.Name,
                SpoolId = createPrintDto.SpoolId,
                GramsUsed = createPrintDto.GramsUsed,
                Status = createPrintDto.Status,
                CreatedAt = DateTime.UtcNow,
                UserId = userId
            };
            await _context.Prints.AddAsync(print);
            await _context.SaveChangesAsync();
            return new PrintDto(print.Id, print.Name, print.SpoolId, print.GramsUsed, print.Status, print.CreatedAt, print.Spool);
        }

        public async Task<bool> DeletePrintAsync(int id, string userId)
        {
            
            var delete = await _context.Prints.Where(p => p.Id == id && p.UserId == userId).FirstOrDefaultAsync();
            if(delete != null)
            {
                _context.Prints.Remove(delete);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<PrintDto?> UpdatePrintAsync(int id, UpdatePrintDto dto, string userId)
        {
            var update = await _context.Prints.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
            if (update == null) return null;
            

            if(dto.Name != null) update.Name = dto.Name;
            if(dto.SpoolId != null) update.SpoolId = dto.SpoolId.Value;
            if(dto.GramsUsed != null) update.GramsUsed = dto.GramsUsed.Value;
            if(dto.Status != null) update.Status = dto.Status.Value;

            await _context.SaveChangesAsync();

            var updateDto = await _context.Prints.Where(p => p.Id == id).Include(p => p.Spool).FirstOrDefaultAsync();
           
            return new PrintDto(updateDto.Id, updateDto.Name, updateDto.SpoolId, updateDto.GramsUsed, updateDto.Status, updateDto.CreatedAt, updateDto.Spool);
        }
    }
}
