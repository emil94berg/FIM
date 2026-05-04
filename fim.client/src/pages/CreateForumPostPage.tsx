import { CreateForumPost } from "@/components/forum/CreateForumPost"
import { ForumHeader } from "@/components/forum/ForumHeader"
import { authFetch } from "@/auth/authFetch"
import type { components } from "@/types/schema"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type ForumPost = components["schemas"]["ForumPostDto"]
type ForumTag = components["schemas"]["ForumPostTags"]

export default function CreateForumPostPage() {
    const navigate = useNavigate();
    const [allTags, setAllTags] = useState<ForumTag[]>([]);

    useEffect(() => {
        const loadTagsName = async () => {
            try {
                const data: ForumTag[] = await authFetch("https://localhost:7035/ForumPost/GetAllTags");
                setAllTags(data);
            }
            catch (error) {
                console.log("Error fetching data from ForumPost... " + error);
            }
        };

        loadTagsName();
    }, []);

    const handleSuccess = (forumPost: ForumPost) => {
        navigate(`/forum/post/${forumPost.id}`);
    };

    return (
        <div className="flex flex-col items-center">
            <ForumHeader tags={allTags}></ForumHeader>
            <div className="mx-auto my-6 w-full max-w-4xl px-4 md:px-6">
                <CreateForumPost
                    tags={allTags}
                    onCancel={() => navigate("/forum")}
                    onSubmitSuccess={handleSuccess}
                ></CreateForumPost>
            </div>
        </div>
    )
}