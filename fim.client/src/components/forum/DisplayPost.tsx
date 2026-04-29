import { useEffect, useState } from "react" 
import { CreateComment } from "@/components/comments/CreateComment";
import type { components } from "@/types/schema"
import { DisplayComments } from "../comments/DisplayComments";
import { authFetch } from "../../auth/authFetch";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button"
import { ChatIcon } from "@/components/icons/mynaui-chat"


type ForumPost = components["schemas"]["ForumPostDto"];
type Comments = components["schemas"]["CommentDto"];

type DisplayPostProps = {
    post: ForumPost;
}

export function DisplayPost({ post }: DisplayPostProps) {
    const [comments, setComments] = useState<Comments[]>([]);

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

    return (
        <div className="mx-auto max-w-3xl bg-slate-100 border rounded-xl mt-4">
            <div className="mx-4 my-2 mt-4"> 
                <h1 className="m-4">{post.title}</h1>
                <div className="bg-gray-100 m-2 p-2 border rounded-xl" style={{ display: "flex", flexDirection: "row" }}>
                    <div className="flex-shrink-0 text-center border-r m-4">
                        <img className="h-24 w-24 rounded-full object-cover ring-2 ring-border m-4" src={imgSource}></img>
                        <p>{post.username}</p>
                        <p>{new Date(post.createdAt).toLocaleString("sv-SE", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}</p>
                        
                    </div>
                    <div className="forum-rich-text" dangerouslySetInnerHTML={{ __html: cleanHtml }}></div>
                    
                </div>
            </div>
            <div className="flex flex-row items-center mx-4">
                <CreateComment forumPost={post} handleUpdateList={handleUpdateList}>
                    <Button className="bg-green-500 text-white">Add Comment</Button>
                </CreateComment>
                <ChatIcon />
                <p>{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</p>
            </div>
            <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
            <div className="mx-4 my-2">
                <DisplayComments onAddComment={handleUpdateList} comments={comments} forumPost={post} onUpdateUpvotes={updateCommentsUpvotes}></DisplayComments>
            </div>
        </div>

    )
}