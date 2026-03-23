namespace FIM.Server.DTOs;

public record NotificationDto(
    int Id,
    string Message,
    string Type,
    bool IsRead,
    DateTime CreatedAt
);
    