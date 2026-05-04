import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label"; 
import { Button } from "@/components/ui/button";
import { supabase } from "@/auth/supabaseClient"
import type { components } from "@/types/schema"
import { authFetch } from "../../auth/authFetch"
import { RichTextEditor } from "@/components/RichTextEditor"





type Comment = components["schemas"]["CreateCommentDto"];
type ForumPost = components["schemas"]["ForumPostDto"];
type CommentDto = components["schemas"]["CommentDto"];

type CreateCommentProps = {
    forumPost: ForumPost;
    commentId?: number;
    children?: React.ReactNode;
    handleUpdateList?: (comment: CommentDto) => void;
    isOpen?: boolean;
    onToggleOpen?: () => void;
    onCancel?: () => void;
    initialContent?: string;
}



export function CreateComment({ forumPost, commentId, children, handleUpdateList, isOpen, onToggleOpen, onCancel, initialContent }: CreateCommentProps){
    const [content, setContent] = useState<string>(initialContent ?? "");
    const [username, setUsername] = useState<string>("");
    const [localOpen, setLocalOpen] = useState<boolean>(false);

    const controlled = typeof isOpen === "boolean";
    const open = controlled ? Boolean(isOpen) : localOpen;

    const toggleOpen = () => {
        if (onToggleOpen) {
            onToggleOpen();
            return;
        }
        setLocalOpen(prev => !prev);
    };

    const closeForm = () => {
        setContent("");
        if (onCancel) {
            onCancel();
            return;
        }
        if (controlled) {
            onToggleOpen?.();
            return;
        }
        setLocalOpen(false);
    };





    async function handleCreateCommentAsync() {
        const newComment: Comment = {
            forumPostId: forumPost.id,
            parentId: commentId ? commentId : null,
            content: content,
            username: username
        }
        try {
            const data: CommentDto = await authFetch("https://localhost:7035/Comment/CreateComment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newComment)
            });
            handleUpdateList?.(data);
            closeForm();
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
        <div className="w-full">
            {children ? (
                <div onClick={toggleOpen}>
                    {children}
                </div>
            ) : null}

            {open ? (
                <div className="mt-3 rounded-xl border bg-white p-3">
                    <form className="space-y-3" onSubmit={(e) => {
                        e.preventDefault();
                        void handleCreateCommentAsync();
                    }}>
                        <div>
                            <Label className="mb-2 block">Content:</Label>
                            <RichTextEditor
                                initialContent={initialContent}
                                onChange={(value) => setContent(value)}
                            ></RichTextEditor>
                        </div>
                        <div className="flex gap-2">
                            <Button className="bg-green-500 text-white" type="submit">Create Comment</Button>
                            <Button className="bg-red-500 text-white" type="button" onClick={closeForm}>Cancel</Button>
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    )
}