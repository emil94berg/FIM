using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace FIM.Server.Models;

public class Print
{
    public int Id { get; set; }
    public string UserId { get; set; }
    [Required(ErrorMessage = "Question text is required")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters")]
    public string Name { get; set; } = string.Empty;
    [Required(ErrorMessage = "You need to choose a spool")]
    public int SpoolId { get; set; }
    [Required(ErrorMessage = "Please enter how many grams is used")]
    public double GramsUsed { get; set; }
    [Required(ErrorMessage = "Please select a status")]
    public PrintStatus Status { get; set; }
    [Required(ErrorMessage = "Print creation date is required")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EstimatedEndTime { get; set; }
    public Spool? Spool { get; set; }
    public DateTime StartedAt { get; set; }



    //För att kunna visa rätt data när vi skapar våra charts
    //public DateTime CompletedAt { get; set; }
}

