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
import { Badge } from "@/components/ui/badge"

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
        <div className="mx-auto max-w-4xl">
            <Button className="bg-green-500 text-white mt-2" onClick={onShowCreate}>Create a new post</Button>
            <div className="">
                {sortPostsByTag(latestPosts).map((p, index) => (
                    <div key={p.id}>
                        {(index === 0 || p.tag !== sortPostsByTag(latestPosts)[index - 1].tag) && (
                            <div className={`mt-4 text-center rounded-xl border ${colorArray[index % colorArray.length]}`}>
                                <p style={{ color: "gray", fontSize: "40px" }}>{p.tag}</p>
                            </div>
                        )}
                        <Link to={`/forum/post/${p.id}`} className="w-full max-w-x1">
                        
                        <div key={p.id} className="mt-4 border rounded-xl p-4 bg-white">
                            <div className="items-center justify-between flex flex-row">
                                <h2 className="text-xl font-bold">{p.title}</h2>
                                <p className="text-sm text-gray-500">Created by: {p.username} • {new Date(p.createdAt).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}</p>
                            </div>

                             <p className="forum-rich-text-preview" dangerouslySetInnerHTML={{ __html:cleanContent(p.text)}}></p>
                            
                            <Badge className="text-sm rounded-2xl text-gray-500">{p.tag}</Badge>
                        </div>
{/* 
                        <Card key={p.id} className="mt-4">
                                <CardHeader>
                                    <CardTitle>{p.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        <div className="forum-rich-text" dangerouslySetInnerHTML={{ __html:cleanContent(p.text)}} />
                                    </CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <p>Created by: {p.username} - {new Date(p.createdAt).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}</p>
                                </CardFooter>
                            </Card> */}
                        </Link>
                    </div>
                ))}
            </div>
            
        </div>
    )
}