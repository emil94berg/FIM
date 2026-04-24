import type { components } from "@/types/schema"
import { Button } from "@/components/ui/button"

type Comments = components["schemas"]["CommentDto"];

type DisplayCommentsProps = {
    comments: Comments[]
}



export function DisplayComments({ comments }: DisplayCommentsProps){
   

    return (
        <div>
            {comments.map(comment => (
                
                <div key={comment.id} className="mx-auto bg-blue-200 border rounded-xl mt-4" style={{ maxWidth: "80%" }}>
                    
                    <div className="bg-gray-200 m-2 p-2 border rounded-xl" style={{ display: "flex", flexDirection: "row" }}>
                        <div className="flex-shrink-0 text-center">
                            <img className="h-24 w-24 rounded-full object-cover ring-2 ring-border m-4" src={`https://zjsclbapwgnhrslrmark.supabase.co/storage/v1/object/public/ProfilesImages/${comment.userId}/profilepictures/avatar`}></img>
                            <p>{comment.username}</p>
                            <p>{new Date(comment.createdAt).toLocaleString("sv-SE", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}</p>
                        </div>
                        <p className="m-4 p-4" style={{ borderLeft: "1px solid black" }}>{comment.content}</p>
                    </div>
                    <Button className="bg-transparent block ml-auto">Reply</Button>
                </div>
            ))}
        </div>
    
    
    
    )
}