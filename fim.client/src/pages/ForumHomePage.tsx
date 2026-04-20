import type { components } from "@/types/schema"
import { authFetch } from "@/auth/authFetch"
import { useState, useEffect } from "react"
import { ForumHeader } from "@/components/forum/ForumHeader"
import { ForumHomeBody } from "@/components/forum/ForumHomeBody"
import { CreateForumPost } from "@/components/forum/CreateForumPost"


type ForumPost = components["schemas"]["ForumPostDto"]

export default function ForumHomePage() {
    const [allPosts, setAllPosts] = useState<ForumPost[]>([]);

    useEffect(() => {
        const loadForumPosts = async () => {
            try {
                const data: ForumPost[] = await authFetch(`https://localhost:7035/ForumPost`);
                setAllPosts(data);
            }
            catch (error) {
                console.log("Error fetching data from ForumPost... " + error);
            }
        };
        loadForumPosts();
    }, [])



    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <ForumHeader></ForumHeader>
            <ForumHomeBody allPosts={allPosts}></ForumHomeBody>
            <CreateForumPost></CreateForumPost>
        </div>
    )
}