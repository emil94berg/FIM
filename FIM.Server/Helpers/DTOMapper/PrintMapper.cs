using FIM.Server.DTOs.PrintDtos;
using FIM.Server.Models;
using System.Runtime.CompilerServices;

namespace FIM.Server.Helpers.DTOMapper
{
    public static class PrintMapper
    {
        public static PrintDto ToPrintDto(this Print print)
        {
            return new PrintDto(print.Id, print.Name, print.SpoolId, print.GramsUsed, print.isDeleted, print.Status, print.CreatedAt,print.StartedAt,print.EstimatedEndTime, print.CompletedAt, print.Spool);
        }
        public static CreatePrintDto ToCreatePrintDto(this Print print)
        {
            return new CreatePrintDto(print.Name, print.SpoolId, print.GramsUsed);
        }
        public static UpdatePrintDto ToUpdatePrintDto(this Print print)
        {
            return new UpdatePrintDto(print.Name, print.SpoolId, print.GramsUsed, print.Status, print.StartedAt, null);
        }
    }
}
