import type { components } from "@/types/schema"
import { authFetch } from "@/auth/authFetch"
import { useState, useEffect } from "react"
import { ForumHeader } from "@/components/forum/ForumHeader"
import { ForumHomeBody } from "@/components/forum/ForumHomeBody"
import { CreateForumPost } from "@/components/forum/CreateForumPost"


type ForumPost = components["schemas"]["ForumPostDto"]
type ForumTag = components["schemas"]["ForumPostTags"]

export default function ForumHomePage() {
    const [allPosts, setAllPosts] = useState<ForumPost[]>([]);
    const [allTags, setAllTags] = useState<ForumTag[]>([]);
    const [showCreate, setShowCreate] = useState<boolean>(false);

    useEffect(() => {
        const loadTagsName = async () => {
            try {
                const data: ForumTag[] = await authFetch(`https://localhost:7035/ForumPost/GetAllTags`);
                setAllTags(data);
            }
            catch (error) {
                console.log("Error fetching data from ForumPost... " + error);
            }
        }
        loadTagsName();
    }, [])
    

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

    const showCreateForumPost = () => {
        setShowCreate(prev => !prev);
    }

    const updateAllPosts = (forumPost: ForumPost) => {
        setAllPosts(prev => [...prev, forumPost]);
    }



    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <ForumHeader tags={allTags}></ForumHeader>
            <ForumHomeBody allPosts={allPosts} onShowCreate={showCreateForumPost}></ForumHomeBody>
            {showCreate ? (<CreateForumPost updateForumPostList={updateAllPosts} tags={allTags} onCancel={showCreateForumPost}></CreateForumPost>) : (null)}
            
        </div>
    )
}