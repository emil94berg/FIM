import type { components } from "@/types/schema"
import { Button } from "@/components/ui/button"
import DOMPurify from "dompurify"
import { CreateComment } from "./CreateComment";
import { useState } from "react";

type Comment = components["schemas"]["CommentDto"];
type ForumPost = components["schemas"]["ForumPostDto"];

type DisplayCommentsProps = {
    comments: Comment[]
    forumPost: ForumPost
}





export function DisplayComments({ comments, forumPost }: DisplayCommentsProps){
    const cleanContent = (content: string) => {
        const cleanHtml = DOMPurify.sanitize(content);
        return cleanHtml;
    }



    interface CommentNode extends Comment {
        replies: CommentNode[];
    }

    const buildTree = (commentList: Comment[]): CommentNode[] => {
        const map: Record<number, CommentNode> = {};
        const tree: CommentNode[] = [];

        commentList.forEach((item) => {
            map[Number(item.id)] = { ...item, replies: [] };
        });

        commentList.forEach((item) => {
            const node = map[Number(item.id)];
            if (item.parentId !== null) {
                const parent = map[Number(item.parentId)];
                if (parent) {
                    parent.replies.push(node);
                } else {
                    //todo: handle deleted
                    tree.push(node);
                }
            } else {
                tree.push(node);
            }
        });

        return tree.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    };
    
    

    return (
        <div>
            {buildTree(comments).map(comment => (
                
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
                        <div className="forum-rich-text" dangerouslySetInnerHTML={{ __html:cleanContent(comment.content)}}>
                        </div>
                        <CreateComment forumPost={forumPost} commentId={Number(comment.id)}>
                            <Button className="bg-transparent block ml-auto">Reply</Button>
                        </CreateComment>
                    </div>
                    
                    <div >
                        {comment.replies.map(reply => (
                            <div>
                                <div key={reply.id} className="mx-auto bg-blue-200 border rounded-xl mt-4" style={{ maxWidth: "90%" }}>
                                <div className="bg-gray-200 m-2 p-2 border rounded-xl" style={{ display: "flex", flexDirection: "row" }}>
                                    <div className="flex-shrink-0 text-center">
                                        <img className="h-24 w-24 rounded-full object-cover ring-2 ring-border m-4" src={`https://zjsclbapwgnhrslrmark.supabase.co/storage/v1/object/public/ProfilesImages/${comment.userId}/profilepictures/avatar`}></img>
                                            <p>{reply.username}</p>
                                            <p>{new Date(reply.createdAt).toLocaleString("sv-SE", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}</p>
                                        </div>
                                        <div className="forum-rich-text" dangerouslySetInnerHTML={{ __html: cleanContent(reply.content) }}>
                                            
                                        </div>
                                        <CreateComment forumPost={forumPost} commentId={Number(reply.id)}>
                                            <Button className="bg-transparent block ml-auto">Reply</Button>
                                        </CreateComment>
                                </div>
                                </div>
                            </div>

                       
                        

                    ))}

                    </div>
                    
                </div>
            ))}
        </div>
    
    
    
    )
}