import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label"; 
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { supabase } from "@/auth/supabaseClient"
import type { components } from "@/types/schema"
import { authFetch } from "../../auth/authFetch";





type Comment = components["schemas"]["CreateCommentDto"];
type ForumPost = components["schemas"]["ForumPostDto"];

type CreateCommentProps = {
    forumPost: ForumPost;
}



export function CreateComment({ forumPost }: CreateCommentProps){
    const [content, setContent] = useState<string>("");
    const [username, setUsername] = useState<string>("");





    async function handleCreateCommentAsync() {
        const newComment: Comment = {
            forumPostId: forumPost.id,
            parentId: null,
            content: content,
            username: username
        }
        try {
            const data = await authFetch("https://localhost:7035/Comment/CreateComment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newComment)
            });
        } catch (error) {
            console.error("Error creating comment:", error);
        }
    }


    useEffect(() => {
        const loadUserName = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                let finishedUsername = user?.user_metadata.username || null;

                if (!finishedUsername && user?.email) {
                    finishedUsername = user.email?.split("@");
                }
                setUsername(finishedUsername);
            }
            catch (error) {
                console.log("could not find user..." + error);
            }
        };
        loadUserName();
    }, []);



    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-green-500 m-4">Add Comment</Button>
                </DialogTrigger>
                <DialogContent className="bg-white sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add Comment</DialogTitle>
                        <DialogDescription>Enter your comment below:</DialogDescription>
                    </DialogHeader>
                    <form>
                        <Label>Content:</Label>
                        <textarea cols={50} rows={10} className="bg-slate-50 border" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                    </form>
                     <DialogFooter>
                        <Button className="bg-green-500 text-white" onClick={handleCreateCommentAsync}>Create Comment</Button>
                        <DialogClose asChild>
                            <Button className="bg-red-500 text-white" onClick={() => setContent("")}>Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}