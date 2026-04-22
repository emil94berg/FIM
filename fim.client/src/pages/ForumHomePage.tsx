import type { components } from "@/types/schema"
import { authFetch } from "@/auth/authFetch"
import { useState, useEffect } from "react"
import { ForumHeader } from "@/components/forum/ForumHeader"
import { ForumHomeBody } from "@/components/forum/ForumHomeBody"
import { CreateForumPost } from "@/components/forum/CreateForumPost"


type ForumPost = components["schemas"]["ForumPostDto"]
type ForumTag = components["schemas"]["ForumPostTags"]

export default function ForumHomePage() {
    const url = "https://localhost:7035/ForumPost";

    const [allPosts, setAllPosts] = useState<ForumPost[]>([]);
    const [allTags, setAllTags] = useState<ForumTag[]>([]);
    const [showCreate, setShowCreate] = useState<boolean>(false);
    const [latestPosts, setLatestPosts] = useState<ForumPost[]>([]);

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
                const data: ForumPost[] = await authFetch(url);
                setAllPosts(data);
            }
            catch (error) {
                console.log("Error fetching data from ForumPost... " + error);
            }
        };
        loadForumPosts();
    }, [])

    useEffect(() => {
        const loadLatestPosts = async () => {
            try {
                const data: ForumPost[] = await authFetch(url + "/GetLatestPosts");
                setLatestPosts(data);
            }
            catch (error) {
                console.log("Error fetching data from ForumPost... " + error);
            }
        };
        loadLatestPosts();
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
            <div className="m-8 rounded-xl border bg-card p-6 shadow-sm bg-slate-100" style={{ alignSelf: "center", maxWidth: "80%" }}>
                <div className="mx-auto" style={{ maxWidth: "80%" }}>
                    <ForumHomeBody latestPosts={latestPosts} allPosts={allPosts} onShowCreate={showCreateForumPost}></ForumHomeBody>
                </div>
                    {showCreate ? (<CreateForumPost updateForumPostList={updateAllPosts} tags={allTags} onCancel={showCreateForumPost}></CreateForumPost>) : (null)}
                </div>
            </div>
        
        
    )
}