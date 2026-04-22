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

type ForumPost = components["schemas"]["ForumPostDto"]


type ForumHomeBodyProps = {
    allPosts: ForumPost[]
    onShowCreate: () => void
    latestPosts: ForumPost[]
}


export function ForumHomeBody({ allPosts, onShowCreate, latestPosts }: ForumHomeBodyProps){

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

    return (
        <>
            <Button className="bg-green-500 mt-2" onClick={onShowCreate}>Create a new post</Button>
            <div>
                {sortPostsByTag(latestPosts).map((p, index) => (
                    <div key={p.id}>
                        {(index === 0 || p.tag !== sortPostsByTag(latestPosts)[index - 1].tag) && (
                            <div className="mt-4 text-center bg-red-200 rounded-xl border">
                                <p style={{ color: "aliceblue", fontSize: "40px" }}>{p.tag}</p>
                            </div>
                        )}
                        <Link to={`/forum/post/${p.id}`} className="w-full max-w-x1">
                            <Card key={p.id} className="mt-4 text-center">
                                <CardHeader>
                                    <CardTitle>{p.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{cutText(p.text, 200)}</CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <p>UserName</p>
                                </CardFooter>
                            </Card>
                        </Link>
                    </div>
                    
                ))}
            </div>
            
        </>
    )
}