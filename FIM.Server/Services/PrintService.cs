using FIM.Server.Data;
using FIM.Server.DTOs.PrintDtos;
using FIM.Server.Helpers.DTOMapper;
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
                        p.EstimatedEndTime,
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
                Status = PrintStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UserId = userId
            };
            await _context.Prints.AddAsync(print);
            await _context.SaveChangesAsync();
            var returnPrint = await _context.Prints.Where(p => p.Id == print.Id).Include(p => p.Spool).FirstOrDefaultAsync();
            return returnPrint.ToPrintDto();
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
        public async Task<(PrintDto? Print, string? Warning)> UpdatePrintAsync(int id, UpdatePrintDto dto, string userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var update = await _context.Prints.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
                if (update == null) return (null, null);

                var startingPrint = dto.Status == PrintStatus.Printing && update.Status != PrintStatus.Printing;

                if (startingPrint)
                {
                    if (dto.EstimatedMinutes == null || dto.EstimatedMinutes <= 0)
                    {
                        await transaction.RollbackAsync();
                        return (null, "Please provide an estimated print time in minutes.");
                    }

                    var spool = await _context.Spools.FirstOrDefaultAsync(s => s.Id == update.SpoolId && s.UserId == userId);

                    if (spool == null)
                    {
                        await transaction.RollbackAsync();
                        return (null, "Spool not found.");
                    }

                    if (spool.RemainingWeight < update.GramsUsed)
                    {
                        await transaction.RollbackAsync();
                        return (null, $"Not enough filament on spool. Remaining: {spool.RemainingWeight}g, Required: {update.GramsUsed}g.");
                    }

                    spool.RemainingWeight -= update.GramsUsed;
                    update.EstimatedEndTime = DateTime.UtcNow.AddMinutes(dto.EstimatedMinutes.Value);
                }

                if (dto.Name != null) update.Name = dto.Name;
                if (dto.SpoolId != null) update.SpoolId = dto.SpoolId.Value;
                if (dto.GramsUsed != null) update.GramsUsed = dto.GramsUsed.Value;
                if (dto.Status != null) update.Status = dto.Status.Value;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var updateDto = await _context.Prints.Where(p => p.Id == id).Include(p => p.Spool).FirstOrDefaultAsync();
                return (updateDto.ToPrintDto(), null);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
