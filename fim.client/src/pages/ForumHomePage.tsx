import type { components } from "@/types/schema"
import { authFetch } from "@/auth/authFetch"
import { useState, useEffect } from "react"
import { ForumHeader } from "@/components/forum/ForumHeader"
import { ForumHomeBody } from "@/components/forum/ForumHomeBody"


type ForumPost = components["schemas"]["ForumPostDto"]
type ForumTag = components["schemas"]["ForumPostTags"]

export default function ForumHomePage() {
    const url = "https://localhost:7035/ForumPost";

    const [allPosts, setAllPosts] = useState<ForumPost[]>([]);
    const [allTags, setAllTags] = useState<ForumTag[]>([]);
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

    return (
        <div className="flex flex-col items-center">
            <ForumHeader tags={allTags}></ForumHeader>
            <div className="mx-auto my-6 w-full max-w-7xl rounded-xl border bg-slate-100 p-4 shadow-sm md:p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <section className="lg:col-span-8">
                        <ForumHomeBody latestPosts={latestPosts}></ForumHomeBody>
                    </section>

                    <aside className="lg:col-span-4">
                        <div className="space-y-5 lg:sticky lg:top-4">
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
            </div>
        </div>
    )
}