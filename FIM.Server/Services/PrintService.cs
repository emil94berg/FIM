using FIM.Server.Data;
using FIM.Server.DTOs.PrintDtos;
using FIM.Server.DTOs.SpoolDtos;
using FIM.Server.Helpers.DTOMapper;
using FIM.Server.Migrations;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.SqlServer.Server;
using System.Formats.Asn1;
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
            var print = await _context.Prints.Include(p => p.Spool).Where(u => u.UserId == userId && u.isDeleted == false).ToListAsync();
            foreach(var p in print){
                var dto = new PrintDto(
                        p.Id,
                        p.Name,
                        p.SpoolId,
                        p.GramsUsed,
                        p.isDeleted,
                        p.Status,
                        p.CreatedAt,
                        null,
                        p.EstimatedEndTime,
                        p.CompletedAt,
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
                delete.isDeleted = true;
                _context.Prints.Update(delete);
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

                string? warning = null;
                var startingPrint = dto.Status == PrintStatus.Printing && update.Status != PrintStatus.Printing;
                var completingPrint = dto.Status == PrintStatus.Completed && update.Status == PrintStatus.Printing;

                if (startingPrint)
                {
                    update.StartedAt = DateTime.UtcNow;

                    if (dto.EstimatedMinutes == null || dto.EstimatedMinutes <= 0)
                    {
                        await transaction.RollbackAsync();
                        return (null, "Please provide an estimated print time in minutes.");
                    }

                    var spoolIdForCheck = dto.SpoolId ?? update.SpoolId;
                    var gramsUsedForCheck = dto.GramsUsed ?? update.GramsUsed;
                    var spool = await _context.Spools.FirstOrDefaultAsync(s => s.Id == spoolIdForCheck && s.UserId == userId);

                    if (spool == null)
                    {
                        await transaction.RollbackAsync();
                        return (null, "Spool not found.");
                    }

                    if (spool.RemainingWeight < gramsUsedForCheck)
                    {
                        warning = $"Warning: Not enough filament on spool. Remaining: {spool.RemainingWeight}g, Required: {gramsUsedForCheck}g. Spool will go negative when completed.";
                    }

                    update.EstimatedEndTime = DateTime.UtcNow.AddMinutes(dto.EstimatedMinutes.Value);
                }

                if (completingPrint)
                {
                    var spoolIdForDeduction = dto.SpoolId ?? update.SpoolId;
                    var gramsUsedForDeduction = dto.GramsUsed ?? update.GramsUsed;
                    var spool = await _context.Spools.FirstOrDefaultAsync(s => s.Id == spoolIdForDeduction && s.UserId == userId);

                    if (spool == null)
                    {
                        await transaction.RollbackAsync();
                        return (null, "Spool not found.");
                    }

                    if (spool.RemainingWeight < gramsUsedForDeduction)
                    {
                        warning = $"Warning: Not enough filament on spool. Remaining: {spool.RemainingWeight}g, Required: {gramsUsedForDeduction}g. Spool will go negative.";
                    }

                    spool.RemainingWeight -= gramsUsedForDeduction;
                    _context.Spools.Update(spool);
                }

                if (dto.Name != null) update.Name = dto.Name;
                if (dto.SpoolId != null) update.SpoolId = dto.SpoolId.Value;
                if (dto.GramsUsed != null) update.GramsUsed = dto.GramsUsed.Value;
                if (dto.Status != null) update.Status = dto.Status.Value;



                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var updateDto = await _context.Prints.Where(p => p.Id == id).Include(p => p.Spool).FirstOrDefaultAsync();
                
                return (updateDto.ToPrintDto(), warning);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<List<PrintDto>> AllPendingPrintsAsync(string userId)
        {
            var pendingPrints = await _context.Prints.Where(p => p.UserId == userId && p.Status == PrintStatus.Pending && p.isDeleted == false).ToListAsync();
            var returnList = new List<PrintDto>();
            foreach (var p in pendingPrints)
            {
                returnList.Add(p.ToPrintDto());
            }
            return returnList;
        }
        public async Task <List<PrintDto>> AllPrintingPrintsAsync(string userId)
        {
            var printing = await _context.Prints.Where(p => p.UserId == userId && p.Status == PrintStatus.Printing && p.isDeleted == false).ToListAsync();
            var returnList = new List<PrintDto>();
            foreach (var p in printing)
            {
                returnList.Add(p.ToPrintDto());
            }
            return returnList;
        }

        public async Task DeductSpoolForCompletedPrintAsync(int printId)
        {
            var print = await _context.Prints.FirstOrDefaultAsync(p => p.Id == printId);
            if (print == null) return;

            var spool = await _context.Spools.FirstOrDefaultAsync(s => s.Id == print.SpoolId && s.UserId == print.UserId);
            if (spool == null) return;

            if (print.GramsUsed > 0)
            {
                spool.RemainingWeight -= print.GramsUsed;
                _context.Spools.Update(spool);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<List<PrintDto>> GetActivePrintsAsync(string userId)
        {
            var list = await _context.Prints.Where(p => p.UserId == userId && p.Status == PrintStatus.Printing && p.isDeleted == false).ToListAsync();
            var returnList = new List<PrintDto>();
            if(list != null)
            {
                foreach(var p in list)
                {
                    var dto = p.ToPrintDto();
                    returnList.Add(dto);
                }
                return returnList;
            }
            else
            {
                return returnList;
            }
        }
        public async Task<PrintDto> CancelPrintAsync(string userId, int printId)
        {
            var result = await _context.Prints.Where(p => p.Id == printId && p.UserId == userId && p.isDeleted == false).FirstOrDefaultAsync();
            if (result != null) 
            {
                result.Status = PrintStatus.Cancelled;
                result.EstimatedEndTime = null;
                _context.Update(result);
                await _context.SaveChangesAsync();
                return result.ToPrintDto();
            } 
            else return null;
        }
        public async Task <PrintDto> StartPrintAsync(int printId, string userId, int estimatedTime)
        {
            var updatePrint = await _context.Prints.Where(p => p.Id == printId && p.UserId == userId && p.isDeleted == false).SingleOrDefaultAsync();
            if (updatePrint != null)
            {
                updatePrint.EstimatedEndTime = DateTime.UtcNow.AddMinutes(estimatedTime);
                updatePrint.Status = PrintStatus.Printing;
                updatePrint.StartedAt = DateTime.UtcNow;
                _context.Update(updatePrint);
                await _context.SaveChangesAsync();
                return updatePrint.ToPrintDto();
            }
            else return null;
        }
        public async Task<List<PrintDto>> GetAllDeletedPrintsAsync(string userId)
        {
            var deletedPrints = await _context.Prints.Where(p => p.UserId == userId && p.isDeleted == true).ToListAsync();

            if(deletedPrints != null && deletedPrints.Count != 0)
            {
                return deletedPrints.Select(p => p.ToPrintDto()).ToList();
            }
            else return new List<PrintDto>();
        }
        public async Task<PrintDto> UpdatePrintStatusAsync(string userId, UpdatePrintStatusDto statusDto)
        {
            var result = await _context.Prints.Where(p => p.UserId == userId && p.Id == statusDto.Id).SingleOrDefaultAsync();
            if (result != null)
            {
                result.Status = statusDto.Status;
                result.isDeleted = false;
                _context.Update(result);
                await _context.SaveChangesAsync();
                return result.ToPrintDto();
            }
            else return null;
        }
        public async Task<bool> HardDeletePrintAsync(PrintDto dto, string userId)
        {
            var result = await _context.Prints.Where(p => p.Id == dto.Id && p.UserId == userId).FirstOrDefaultAsync();
            if (result != null)
            {
                _context.Remove(result);
                await _context.SaveChangesAsync();
                return true;
            }
            else return false;
        }
        public async Task<List<PrintDto>> GetAllFinishedPrintsAsync(string userId)
        {
            var result = await _context.Prints.Where(p => p.Status == PrintStatus.Completed && p.UserId == userId).ToListAsync();
            if(result != null && result.Count != 0)
            {
                return result.ToPrintDtoList();
            }
            else
            {
                return new List<PrintDto>();
            }
        }
        public async Task<PrintDto> RegretFinishedPrint(int printId, string userId)
        {
            var updatePrint = await _context.Prints.FirstOrDefaultAsync(p => p.UserId == userId && p.Id == printId);
            if(updatePrint != null)
            {
                var updateSpool = await _context.Spools.FirstOrDefaultAsync(s => s.Id == updatePrint.SpoolId && s.UserId == userId);
                if(updateSpool != null)
                {
                    updateSpool.RemainingWeight += updatePrint.GramsUsed;
                    _context.Spools.Update(updateSpool);
                    await _context.SaveChangesAsync();
                }
                updatePrint.Status = PrintStatus.Pending;
                updatePrint.EstimatedEndTime = null;
                updatePrint.StartedAt = new DateTime();
                _context.Update(updatePrint);
                await _context.SaveChangesAsync();
                return updatePrint.ToPrintDto();
            }
            else return null;
        }


    }
}
