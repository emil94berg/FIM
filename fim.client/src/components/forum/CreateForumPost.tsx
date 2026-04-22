import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { authFetch } from "@/auth/authFetch"
import type { components } from "../../types/schema"

type CreateForumPost = components["schemas"]["CreateForumPostDto"];
type ForumTag = components["schemas"]["ForumPostTags"]
type ForumPost = components["schemas"]["ForumPostDto"];


type createForumPostProps = {
    tags: ForumTag[];
    onCancel: () => void;
    updateForumPostList: (forumPost: ForumPost) => void;
}


export function CreateForumPost({ tags, onCancel, updateForumPostList} : createForumPostProps) {
    const [formData, setFormData] = useState<CreateForumPost>({
        title: "",
        text: "",
        subject: "",
        tag: "Help"
    })

    const url = "https://localhost:7035/ForumPost"

    const onCreateForumPostSubmit = async (forumPost: CreateForumPost) => {
        try {
            const data: ForumPost = await authFetch(url + "/CreateForumPost", {
                method: "POST",
                body: JSON.stringify(forumPost)
            });
            updateForumPostList(data);
            onCancel();
        }
        catch (error) {
            console.log("Failed to fetch from forum post..." + error);
        }
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onCreateForumPostSubmit(formData);
    }

    return (
        <div>
            <Dialog open onOpenChange={(open: boolean) => {
                if (!open) onCancel();
            }}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Forum post</DialogTitle>
                        <DialogDescription>Create a new forum post with the form below</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <Label>Title:</Label>
                        <Input type="text" onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required={true}></Input>
                        <Label>Content:</Label>
                        <textarea className="bg-white" rows={10} cols={180} onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))} required={true} style={{border: "1px solid black"} }></textarea>
                        <Label>Subject:</Label>
                        <Input type="text" onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} required={true}></Input>
                        <Label>Tag:</Label>
                        <Select value={formData.tag} onValueChange={(value) => setFormData(prev => ({ ...prev, tag: value as ForumTag }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a tag" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup className="bg-white">
                                    <SelectLabel>Tags</SelectLabel>
                                    {tags.map(p => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <DialogFooter>
                            <Button className="bg-blue-500" type="submit">Save</Button>
                            <Button className="bg-red-500" type="button" onClick={onCancel}>Cancel</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}