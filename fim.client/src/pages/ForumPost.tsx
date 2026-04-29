import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { components } from "@/types/schema"
import { authFetch } from "../auth/authFetch";
import { DisplayPost } from "@/components/forum/DisplayPost";

type ForumPost = components["schemas"]["ForumPostDto"];





export default function ForumPost() {
    const { id } = useParams();
    const url = `https://localhost:7035/ForumPost/`
    const [post, setPost] = useState<ForumPost |null>(null);

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
    }, [url, id]);



    if (!post) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }
    else {
        return (
            <div>
                <DisplayPost post={post}></DisplayPost>
            </div>
        )
    }
    

}