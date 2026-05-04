import { useEffect, useState, useRef } from "react" 
import { CreateComment } from "@/components/comments/CreateComment";
import type { components } from "@/types/schema"
import { DisplayComments } from "../comments/DisplayComments";
import { authFetch } from "../../auth/authFetch";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button"
import { ChatIcon } from "@/components/icons/mynaui-chat"
import { Badge } from "@/components/ui/badge";


type ForumPost = components["schemas"]["ForumPostDto"];
type Comments = components["schemas"]["CommentDto"];

type DisplayPostProps = {
    post: ForumPost;
}

export function DisplayPost({ post }: DisplayPostProps) {
    const [comments, setComments] = useState<Comments[]>([]);
    const [showCreateComment, setShowCreateComment] = useState<boolean>(false);
    const [commentQuote, setCommentQuote] = useState<string>("");
    const postBodyRef = useRef<HTMLDivElement>(null);

    const url = "https://localhost:7035/Comment"

    useEffect(() => {
        const loadComments = async () => {
            try {
                const data: Comments[] = await authFetch(url + "/" + post.id)
                setComments(data);
            }
            catch (error) {
                console.log("could not fetch from comments..." + error);
            }
        };
        loadComments();
    }, [post.id])
    
    const handleUpdateList = (comment: Comments) => {
        setComments(prev => [...prev, comment]);
    }

    const imgSource = "https://zjsclbapwgnhrslrmark.supabase.co/storage/v1/object/public/ProfilesImages/"
        + post.userId + "/profilepictures/avatar"

    
    const cleanHtml = DOMPurify.sanitize(post.text)

    const updateCommentsUpvotes = (updatedComment: Comments) => {
        setComments(prev =>
            prev.map(c =>
                c.id === updatedComment.id ? { ...updatedComment } : c
            )
        );
    };

    const onDeleteComment = (commentId: number) => {
        setComments(prev => prev.filter(c => c.id !== commentId));
    }

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mx-4 my-2 mt-4 bg-blue-200 p-2 rounded-xl">
                <div className="flex flex-row">
                    <h1 className="m-4">{post.title}</h1>
                    <div className="flex flex-row items-center justify-end flex-1 gap-2">
                        <p>{post.username} • {new Date(post.createdAt).toLocaleString("sv-SE", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}</p>
                        <img className="h-14 w-14 rounded-full object-cover ring-2 ring-border m-4" src={imgSource}></img>
                    </div>
                </div>
                <Badge className="m-2 border rounded-xl">{post.tag}</Badge>
                
                <div className="bg-white m-2 p-2 border rounded-xl" style={{ display: "flex", flexDirection: "row" }} ref={postBodyRef}>
                    <div className="forum-rich-text" dangerouslySetInnerHTML={{ __html: cleanHtml }}></div>
                </div>

                <div className="flex flex-row items-center justify-items-start mx-4">
                    <div className="flex flex-row items-center">
                        <Badge className="border rounded-xl"><ChatIcon className="h-5 w-5" /> {comments.length} {comments.length === 1 ? "Comment" : "Comments"}</Badge>
                    </div>
                </div>
            </div>

            <div className="mx-4 mt-3">
                <CreateComment
                    forumPost={post}
                    handleUpdateList={handleUpdateList}
                    isOpen={showCreateComment}
                    onToggleOpen={() => {
                        if (showCreateComment) {
                            setShowCreateComment(false);
                            setCommentQuote("");
                            return;
                        }
                        const selection = window.getSelection();
                        const selectedText = selection?.toString().trim() ?? "";
                        let quoteHtml = "";
                        if (selectedText && postBodyRef.current && selection) {
                            const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                            if (range && postBodyRef.current.contains(range.commonAncestorContainer)) {
                                quoteHtml = `<blockquote><p>${DOMPurify.sanitize(selectedText)}</p></blockquote><p></p>`;
                            }
                        }
                        setCommentQuote(quoteHtml);
                        setShowCreateComment(true);
                    }}
                    onCancel={() => setShowCreateComment(false)}
                    initialContent={commentQuote}
                >
                    <Button className="bg-green-500 text-white">Add Comment</Button>
                </CreateComment>
            </div>

            <hr className="my-5 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-25 dark:via-blue-400" />
            <div className="mx-4 my-2 bg-slate-100 border rounded-xl mt-4">
                <DisplayComments onAddComment={handleUpdateList} comments={comments} forumPost={post} onUpdateUpvotes={updateCommentsUpvotes} onUpdateDeleteComment={onDeleteComment}></DisplayComments>
            </div>
        </div>

    )
}