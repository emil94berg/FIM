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
}


export function ForumHomeBody({ allPosts, onShowCreate }: ForumHomeBodyProps){

    const cutText = (text: string, cutNumber: number) => {
        if (text.length > cutNumber) {
            return text.substring(0, cutNumber) + "...";
        }
        return text;
    }

    return (
        <div>
            <Button className="bg-green-500 mt-2" onClick={onShowCreate}>Create</Button>
            {allPosts.map(p => (
                <Link key={p.id} to={`/forum/post/${p.id}`}>
                    <Card key={p.id} className="mt-2" style={{ textAlign: "center" }}>
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
            ))}
        </div>
    )
}