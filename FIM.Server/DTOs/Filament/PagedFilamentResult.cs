using static FIM.Server.DTOs.Filament.FilamentRecord;

namespace FIM.Server.DTOs.Filament
{
    public class PagedFilamentResult
    {
        public List<FilamentRecordDto> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}