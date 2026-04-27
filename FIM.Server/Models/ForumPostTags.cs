using System.Text.Json.Serialization;

namespace FIM.Server.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ForumPostTags
    {
        AMA,
        Help,
        Question,
        Discussion,
        Showcase
    }
}
