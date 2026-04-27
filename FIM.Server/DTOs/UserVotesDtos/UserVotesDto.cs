namespace FIM.Server.DTOs.UserVotesDtos
{
    public record UserVotesDto(
            int id,
            string userId,
            int commentId,
            int postId
        );

    public record CreateUserVotesDto(
        int commentId,
        int postId
    );

    public static class UserVotesDtoExtensions
    {
        public static UserVotesDto ToUserVotesDto(this Models.UserVotes userVotes)
        {
            return new UserVotesDto(
                userVotes.Id,
                userVotes.UserId,
                userVotes.CommentId,
                userVotes.PostId
            );
        }
        
        public static List<UserVotesDto> ToUserVotesDtoList(this List<Models.UserVotes> userVotes)
        {
            return userVotes.Select(uv => uv.ToUserVotesDto()).ToList();
        }
    }



}
