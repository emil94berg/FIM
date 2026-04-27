using Microsoft.Identity.Client;

namespace FIM.Server.DTOs.SpoolDtos
{
    public record SpoolGroupDto(
        string Identifier,
        List<SpoolDto> Spools
        );
}
