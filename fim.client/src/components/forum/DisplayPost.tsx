import { useEffect, useState } from "react" 
import { CreateComment } from "@/components/comments/CreateComment";
import type { components } from "@/types/schema"
import { DisplayComments } from "../comments/DisplayComments";
import { authFetch } from "../../auth/authFetch";


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
    


    const imgSource = "https://zjsclbapwgnhrslrmark.supabase.co/storage/v1/object/public/ProfilesImages/"
        + post.userId + "/profilepictures/avatar"






    return (
        <div className="mx-auto bg-blue-100 border rounded-xl mt-4" style={{maxWidth: "80%"} }>
            <h1 className="m-4">{post.title}</h1>
            <div className="bg-gray-100 m-2 p-2 border rounded-xl" style={{ display: "flex", flexDirection: "row" }}>
                <div className="flex-shrink-0 text-center">
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
                <p className="m-4 p-4" style={{borderLeft:"1px solid black"}}>{post.text}</p>
            </div>
            <CreateComment forumPost={post}></CreateComment>
            <DisplayComments comments={comments}></DisplayComments>
        </div>

    )
}