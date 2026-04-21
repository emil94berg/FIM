import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { components } from "@/types/schema"
import { authFetch } from "../auth/authFetch";

type ForumPost = components["schemas"]["ForumPostDto"];





export default function ForumPost() {
    const { id } = useParams();
    const url = `https://localhost:7035/ForumPost/`
    const [post, setPost] = useState<ForumPost>({
        id: 1,
        title: "",
        userId: "",
        text: "",
        subject: "",
        tag: "Help"
    });

    useEffect(() => {
        const loadPost = async () => {
            try {
                const data: ForumPost = await authFetch(url + `${id}`);
                setPost(data);
            }
            catch (error) {
                console.log("Failed to fetch from forum post..." + error);
            }
        };
        loadPost();
    }, [id]);




    return (
        <div>
            <h1>Post sida</h1>
            {post === null ? ("Loading...")
                :
                (
                    <h1>{post.id} {post.title}</h1>
                )
            }
            
        </div>
    )

}