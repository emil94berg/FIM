import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { components } from "@/types/schema"
import { Link } from "react-router-dom"
import DOMPurify from "dompurify";

type ForumPost = components["schemas"]["ForumPostDto"]


type ForumHomeBodyProps = {
    allPosts: ForumPost[]
    onShowCreate: () => void
    latestPosts: ForumPost[]
}


export function ForumHomeBody({ allPosts, onShowCreate, latestPosts }: ForumHomeBodyProps) {

    const colorArray = ["bg-green-200", "bg-orange-200", "bg-blue-200", "bg-yellow-200", "bg-purple-200", "bg-pink-200", "bg-red-200"];

    const cutText = (text: string, cutNumber: number) => {
        if (text.length > cutNumber) {
            return text.substring(0, cutNumber) + "...";
        }
        return text;
    }

    const sortPostsByTag = (posts: ForumPost[]) => {
        posts.sort((a, b) => {
            if (a.tag < b.tag) {
                return -1;
            }
            else if (a.tag > b.tag) {
                return 1;
            }
            else {
                return 0;
            }
        });
        return posts;
    }

    const cleanContent = (content: string) => {
        const newText = cutText(content, 200);
        const cleanHtml = DOMPurify.sanitize(newText);
        return cleanHtml;
    }
    

    return (
        <>
            <Button className="bg-green-500 text-white mt-2" onClick={onShowCreate}>Create a new post</Button>
            <div>
                {sortPostsByTag(latestPosts).map((p, index) => (
                    <div key={p.id}>
                        {(index === 0 || p.tag !== sortPostsByTag(latestPosts)[index - 1].tag) && (
                            <div className={`mt-4 text-center rounded-xl border ${colorArray[index % colorArray.length]}`}>
                                <p style={{ color: "gray", fontSize: "40px" }}>{p.tag}</p>
                            </div>
                        )}
                        <Link to={`/forum/post/${p.id}`} className="w-full max-w-x1">
                            <Card key={p.id} className="mt-4">
                                <CardHeader>
                                    <CardTitle>{p.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        <div className="forum-rich-text" dangerouslySetInnerHTML={{ __html:cleanContent(p.text)}}>
                                           
                                        </div>
                                    </CardDescription>
                                       
                                </CardContent>
                                <CardFooter>
                                    <p>Created by: {p.username} - {new Date(p.createdAt).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}</p>
                                </CardFooter>
                            </Card>
                        </Link>
                    </div>
                ))}
            </div>
            
        </>
    )
}