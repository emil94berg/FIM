import type { components } from "@/types/schema"
import { authFetch } from "@/auth/authFetch"
import { useState, useEffect } from "react"
import { ForumHeader } from "@/components/forum/ForumHeader"
import { ForumHomeBody } from "@/components/forum/ForumHomeBody"
import { CreateForumPost } from "@/components/forum/CreateForumPost"


type ForumPost = components["schemas"]["ForumPostDto"]
type ForumTag = components["schemas"]["ForumPostTags"]

export default function ForumHomePage() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
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

    const displayPostsOnTag = async (tag: ForumTag) => {
        try {
            const data: ForumPost[] = await authFetch(`${apiUrl}/ForumPost/GetPostsOnTag/${tag}`);
            setLatestPosts(data);
        }
        catch (error) {
            console.log("Failed to fetch from forumpost..." + error);
        }
    }



    return (
        <div className="flex flex-col items-center">
            <ForumHeader onDisplayPostOnForumTag={displayPostsOnTag} tags={allTags}></ForumHeader>
            <div className="mx-auto my-6 w-full max-w-7xl rounded-xl border bg-slate-100 p-4 shadow-sm md:p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <section className="lg:col-span-8">
                        <ForumHomeBody latestPosts={latestPosts} allPosts={allPosts} onShowCreate={showCreateForumPost}></ForumHomeBody>
                    </section>

                    <aside className="lg:col-span-4">
                        <div className="space-y-5 lg:top-4">
                            <div className="rounded-xl border bg-white p-4">
                                <h2 className="text-sm font-semibold text-slate-800">Activity</h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Latest forum activity
                                </p>

                                <div className="mt-3 space-y-3">
                                    {latestPosts.slice(0, 5).map(post => (
                                        <div key={post.id} className="rounded-lg border bg-slate-50 p-2">
                                            <p className="line-clamp-1 text-sm font-medium text-slate-800">{post.title}</p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {post.username} • {new Date(post.createdAt).toLocaleString("sv-SE", {
                                                    dateStyle: "short",
                                                    timeStyle: "short"
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                    {latestPosts.length === 0 && (
                                        <p className="text-xs text-slate-500">No recent activity yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl border bg-white p-4">
                                <h2 className="text-sm font-semibold text-slate-800">Top Tags</h2>
                                <p className="mt-1 text-xs text-slate-500">Most active tags right now</p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <p className="text-xs text-slate-500">To be implemented</p>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-white p-4">
                                <h2 className="text-sm font-semibold text-slate-800">Forum stats</h2>
                                <div className="rounded-lg border bg-slate-50 p-2">
                                    <p className="line-clamp-1 text-sm font-medium text-slate-800">Total posts: {allPosts.length}</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
                    {showCreate ? (<CreateForumPost updateForumPostList={updateAllPosts} tags={allTags} onCancel={showCreateForumPost}></CreateForumPost>) : (null)}
            </div>
        </div>
    )
}