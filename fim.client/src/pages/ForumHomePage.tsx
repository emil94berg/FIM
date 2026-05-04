import type { components } from "@/types/schema"
import { authFetch } from "@/auth/authFetch"
import { useState, useEffect } from "react"
import { ForumHeader } from "@/components/forum/ForumHeader"
import { ForumHomeBody } from "@/components/forum/ForumHomeBody"
import { CreateForumPost } from "@/components/forum/CreateForumPost"
import { Button } from "@/components/ui/button"


type ForumPost = components["schemas"]["ForumPostDto"]
type ForumTag = components["schemas"]["ForumPostTags"]
type PagedForumPost = components["schemas"]["PagedForumPostResult"]

export default function ForumHomePage() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const url = "https://localhost:7035/ForumPost";

    const [currentTag, setCurrentTag] = useState<ForumTag | null>(null);
    const [allPosts, setAllPosts] = useState<ForumPost[]>([]);
    const [allTags, setAllTags] = useState<ForumTag[]>([]);
    const [showCreate, setShowCreate] = useState<boolean>(false);
    const [latestPosts, setLatestPosts] = useState<ForumPost[]>([]);
    const [pagedForumPost, setPagedForumPost] = useState<PagedForumPost>({
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10
    });

    const startEntry = (Number(pagedForumPost.pageNumber) - 1) * Number(pagedForumPost.pageSize) + 1;
    const endEntry = Math.min(Number(pagedForumPost.pageNumber) * Number(pagedForumPost.pageSize), Number(pagedForumPost.totalCount));

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

    //const displayPostsOnTag = async (tag: ForumTag) => {
    //    try {
    //        const data: ForumPost[] = await authFetch(`${apiUrl}/ForumPost/GetPostsOnTag?pageNumber=${pagedForumPost.pageNumber}
    //        &pageSize=${pagedForumPost.pageSize}&tag=${tag}`);
    //        setLatestPosts(data);
    //    }
    //    catch (error) {
    //        console.log("Failed to fetch from forumpost..." + error);
    //    }
    //}

    const displayPagedPostsOnTag = async (tag: ForumTag) => {     
        setCurrentTag(tag);
        try {
            const data: PagedForumPost = await authFetch(`${apiUrl}/ForumPost/GetPagedPostOnTag?pageNumber=${pagedForumPost.pageNumber}&pageSize=${pagedForumPost.pageSize}&tag=${tag}`);
            setPagedForumPost(data);
            if (data.items !== undefined) {
                updatePagedPosts(data.items);
            }
        }
        catch (error) {
            console.log("Failed to fetch from forumpost..." + error);
        }
    }

    const updatePagedPosts = (forumPosts: ForumPost[]) => {
        setLatestPosts(forumPosts);
    }

    const loadPage = async (page: number) => {
        if (!currentTag) return;

        const data: PagedForumPost = await authFetch(`${apiUrl}/ForumPost/GetPagedPostOnTag?pageNumber=${page}&pageSize=${pagedForumPost.pageSize}&tag=${currentTag}`);
        setPagedForumPost(data);
        if (data.items !== undefined) {
            updatePagedPosts(data.items);
        }
    }





    return (
        <div className="flex flex-col items-center">
            <ForumHeader onDisplayPostOnForumTag={displayPagedPostsOnTag} tags={allTags}></ForumHeader>
            <div className="mx-auto my-6 w-full max-w-7xl rounded-xl border bg-slate-100 p-4 shadow-sm md:p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <section className="lg:col-span-8">
                        <ForumHomeBody latestPosts={latestPosts} allPosts={allPosts} onShowCreate={showCreateForumPost}></ForumHomeBody>

                        {currentTag !== null && <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing <strong>{startEntry}</strong> to <strong>{endEntry}</strong> of <strong>{pagedForumPost.totalCount}</strong> entries
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button
                                    className="bg-blue-500 text-white"
                                    variant="outline"
                                    disabled={Number(pagedForumPost.pageNumber) === 1}
                                    onClick={() => 
                                        loadPage(Number(pagedForumPost.pageNumber) - 1)
                                    }
                                    >
                                    Previous
                                </Button>

                                <div className="text-sm">
                                    Page {pagedForumPost.pageNumber} of {Math.ceil(Number(pagedForumPost.totalCount) / Number(pagedForumPost.pageSize)) || 1}
                                </div>

                                <Button
                                    className="bg-blue-500 text-white"
                                    variant="outline"
                                    disabled={endEntry >= Number(pagedForumPost.totalCount)}
                                    onClick={() =>
                                        loadPage(Number(pagedForumPost.pageNumber) + 1)
                                        }>
                                    Next
                                </Button>
                            </div>
                        </div>}

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