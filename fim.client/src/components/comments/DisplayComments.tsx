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
import { ConfirmDialog } from "@/components/popUp/ConfirmPopup"


const apiUrl = import.meta.env.VITE_API_BASE_URL


type Comment = components["schemas"]["CommentDto"];
type ForumPost = components["schemas"]["ForumPostDto"];
type CreateUserVote = components["schemas"]["CreateUserVotesDto"];
type UserVote = components["schemas"]["UserVotesDto"];


type DisplayCommentsProps = {
    comments: Comment[]
    forumPost: ForumPost
    onAddComment: (comment: Comment) => void
    onUpdateUpvotes: (comment: Comment) => void
    onUpdateDeleteComment: (commentid: number) => void
}

interface CommentNode extends Comment {
    replies: CommentNode[];
}

interface Props {
    comment: CommentNode;
    depth?: number;
}

export function DisplayComments({ comments, forumPost, onAddComment, onUpdateUpvotes, onUpdateDeleteComment }: DisplayCommentsProps) {
    const [userVotes, setUserVotes] = useState<UserVote[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null);



    const cleanContent = (content: string) => {
        const cleanHtml = DOMPurify.sanitize(content);
        return cleanHtml;
    }

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
            const data: UserVote = await authFetch(apiUrl + "/UserVotes/" + "CreateVoteForUserOnPost", {
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
    const onRemoveUpvotedComment = async (comment: Comment) => {
        try {
            const removeVote: CreateUserVote = {
                commentId: comment.id,
                postId: Number(forumPost.id)
            }
            const data: number = await authFetch(`${apiUrl}/UserVotes/RemoveUserVoteForComment`, {
                method: "DELETE",
                body: JSON.stringify(removeVote)
            })
            if (data !== 0) {
                const updatedComment: Comment = {
                    ...comment,
                    upVotes: Number(comment.upVotes) - 1
                };
                onUpdateUpvotes(updatedComment);
                setUserVotes(prev => prev.filter(uv => uv.id !== data));
            }
        }
        catch (error) {
            console.log("Failed to fetch from UserVotes..." + error);
        }
    }

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

    const onDeleteComment = async (comment: Comment) => { 
        try {
            const data: number = await authFetch(apiUrl + "/Comment/HardDelete/" + comment.id, {
                method: "DELETE"
            });
            onUpdateDeleteComment(data);
        }
        catch (error) {
            console.log("Failed to delete comment..." + error);
        }
    }

    

    useEffect(() => {
        const loadUserVotes = async () => {
            try {
                const data: UserVote[] = await authFetch(apiUrl + "/UserVotes/" + forumPost.id);
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
    }, [])

    function CommentItem({ comment, depth = 0 }: Props) {
        const avatarClass = depth === 0 ? "h-9 w-9" : "h-8 w-8";

        return (
            <div className="mt-3 ">
                <div className="flex items-start gap-3">
                    <img className={`${avatarClass} flex-shrink-0 rounded-full object-cover ring-1 ring-border`} src={`https://zjsclbapwgnhrslrmark.supabase.co/storage/v1/object/public/ProfilesImages/${comment.userId}/profilepictures/avatar`}></img>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <p className="font-semibold text-slate-800">{comment.username}</p>
                            <span className="text-slate-400">•</span>
                            <p className="text-slate-500">{new Date(comment.createdAt).toLocaleString("sv-SE", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}</p>
                        </div>

                        <div className="forum-rich-text mt-1 break-words text-sm leading-6 text-slate-800" dangerouslySetInnerHTML={{ __html: cleanContent(comment.content) }}></div>

                        <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                            {upVoted(comment) ? (
                                <Button className="h-auto bg-transparent px-1 py-0 text-slate-600 hover:bg-transparent" onClick={() => onRemoveUpvotedComment(comment)} ><FatArrowUpSolidIcon className="text-green-500"></FatArrowUpSolidIcon></Button>
                            ) : (
                                <Button className="h-auto bg-transparent px-1 py-0 text-slate-600 hover:bg-transparent" onClick={() => onUpvoteComment(comment)} ><FatArrowUpIcon></FatArrowUpIcon></Button>
                            )}

                            <span className="font-medium text-slate-700">{comment.upVotes}</span>

                            <Button
                                className="h-auto bg-transparent px-1 py-0 text-sm font-medium text-slate-600 hover:bg-transparent hover:text-slate-900"
                                onClick={() => setActiveReplyId(prev => prev === Number(comment.id) ? null : Number(comment.id))}
                            >
                                Reply
                            </Button>
                            {currentUserId === comment.userId ? (<ConfirmDialog
                                title="Delete comment!"
                                description={`Are you sure you want to delete this comment, the action cannot be undone`}
                                confirmText="Delete"
                                cancelText="Cancel"
                                cancelButtonClassName="bg-red-300"
                                confirmButtonClassName="bg-red-500"
                                onConfirm={() => onDeleteComment(comment)}>
                                <Button className="h-auto bg-transparent px-1 py-0 text-sm font-medium text-slate-600 hover:bg-transparent hover:text-slate-900">Delete</Button>
                                </ConfirmDialog>)
                                :
                                (null)}
                            
                        </div>

                        <div className="mt-2">
                            <CreateComment
                                forumPost={forumPost}
                                commentId={Number(comment.id)}
                                handleUpdateList={onAddComment}
                                isOpen={activeReplyId === Number(comment.id)}
                                onCancel={() => setActiveReplyId(null)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-2 ml-4 border-l border-slate-300 pl-2">
                    {comment.replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                    ))}
                </div>
            </div>

        );
    }

    if (comments.length === 0) {
        return (
            <div className="text-center text-gray-500 my-4">
                <p>No comments yet. Be the first to comment!</p>
            </div>
        );
    }

    return (
        <div className="px-3">
            {buildTree(comments).map(comment => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
    );
}