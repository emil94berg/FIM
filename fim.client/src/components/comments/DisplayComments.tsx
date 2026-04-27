import type { components } from "@/types/schema"
import { Button } from "@/components/ui/button"
import DOMPurify from "dompurify"
import { CreateComment } from "./CreateComment"
import { FatArrowUpIcon } from "@/components/icons/mynaui-fat-arrow-up"
import { FatArrowUpSolidIcon } from "@/components/icons/mynaui-fat-arrow-up-solid"
import { authFetch } from "../../auth/authFetch"
import { useState, useEffect } from "react"
import { supabase } from "@/auth/supabaseClient"
import { toast } from "sonner"


type Comment = components["schemas"]["CommentDto"];
type ForumPost = components["schemas"]["ForumPostDto"];
type CreateUserVote = components["schemas"]["CreateUserVotesDto"];
type UserVote = components["schemas"]["UserVotesDto"];


type DisplayCommentsProps = {
    comments: Comment[]
    forumPost: ForumPost
    onAddComment: (comment: Comment) => void
    onUpdateUpvotes: (comment: Comment) => void
}

interface CommentNode extends Comment {
    replies: CommentNode[];
}

interface Props {
    comment: CommentNode;
}

export function DisplayComments({ comments, forumPost, onAddComment, onUpdateUpvotes }: DisplayCommentsProps) {
    const [userVotes, setUserVotes] = useState<UserVote[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>("");

    

    const cleanContent = (content: string) => {
        const cleanHtml = DOMPurify.sanitize(content);
        return cleanHtml;
    }

    const url = "https://localhost:7035/UserVotes";

    const buildTree = (commentList: Comment[]): CommentNode[] => {
        const map: Record<number, CommentNode> = {};
        const tree: CommentNode[] = [];

        commentList.forEach((item) => {
            map[Number(item.id)] = { ...item, replies: [] };
        });

        commentList.forEach((item) => {
            const node = map[Number(item.id)];
            if (item.parentId !== null) {
                const parent = map[Number(item.parentId)];
                if (parent) {
                    parent.replies.push(node);
                } else {
                    //todo: handle deleted
                    tree.push(node);
                }
            } else {
                tree.push(node);
            }
        });

        return tree.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    };

    const onUpvoteComment = async (comment: Comment) => {

        try {
            const newVote: CreateUserVote = {
                commentId: comment.id,
                postId: Number(forumPost.id)
            }
            const data: UserVote = await authFetch(url + "/" + "CreateVoteForUserOnPost", {
                method: "POST",
                body: JSON.stringify(newVote)
            });
            if (data) {
                const updatedComment: Comment = {
                    ...comment,
                    upVotes: Number(comment.upVotes) + 1
                };
                onUpdateUpvotes(updatedComment);
                setUserVotes(prev => [...prev, data]);
            }
            
        }
        catch (error) {
            console.log("Could not fetch from UserVotes..." + error);
        }
    };

    const upVoted = (comment: Comment) => {
        //Kan inte kolla uv.userId utan måste kolla på den inloggade användaren (uv.userId === currentUserId)
        const voted = userVotes.find(uv => uv.commentId === comment.id &&
            uv.postId === comment.forumPostId &&
            uv.userId === currentUserId
        );
        if (voted) {
            return true
        }
        else {
            return false
        }
    }

    useEffect(() => {
        const loadUserVotes = async () => {
            try {
                const data: UserVote[] = await authFetch(url + "/" + forumPost.id);
                setUserVotes(data);
            }
            catch (error) {
                console.log("Failed to fetch from UserVotes..." + error);
            }

        };
        loadUserVotes();
    }, [forumPost.id]);

    useEffect(() => {
        const loadUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            setCurrentUserId(data.user?.id || "");
            if (error) {
                toast.error("Failed to load user data");
            }
        };
        loadUser();
    },[])
    
    function CommentItem({ comment }: Props) {
        return (
            <div key={comment.id} className="mx-auto bg-blue-200 border rounded-xl mt-4" style={{ maxWidth: "90%" }}>
                <div className="bg-gray-200 m-2 p-2 border rounded-xl" style={{ display: "flex", flexDirection: "row" }}>
                    <div className="flex-shrink-0 text-center">
                        <img className="h-12 w-12 rounded-full object-cover ring-2 ring-border m-4" src={`https://zjsclbapwgnhrslrmark.supabase.co/storage/v1/object/public/ProfilesImages/${comment.userId}/profilepictures/avatar`}></img>
                        <p>{comment.username}</p>
                        <p>{new Date(comment.createdAt).toLocaleString("sv-SE", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}</p>
                    </div>
                    <div className="forum-rich-text" dangerouslySetInnerHTML={{ __html: cleanContent(comment.content) }}>
                        
                    </div>
                    <CreateComment forumPost={forumPost} commentId={Number(comment.id)} handleUpdateList={onAddComment}>
                        <Button className="bg-transparent block ml-auto">Reply</Button>
                    </CreateComment>
                    {upVoted(comment) ? (
                        <Button className="bg-transparent" onClick={() => onUpvoteComment(comment)} ><FatArrowUpSolidIcon className="text-green-500"></FatArrowUpSolidIcon></Button>
                    ) : (
                        <Button className="bg-transparent" onClick={() => onUpvoteComment(comment)} ><FatArrowUpIcon></FatArrowUpIcon></Button>
                    )}
                    
                    <p>{comment.upVotes}</p>
                    
                </div>
                <div>
                    {comment.replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            {buildTree(comments).map(comment => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
    );
}