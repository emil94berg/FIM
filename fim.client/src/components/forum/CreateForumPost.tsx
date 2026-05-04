import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authFetch } from "@/auth/authFetch"
import { supabase } from "@/auth/supabaseClient"
import type { components } from "../../types/schema"
import { RichTextEditor } from "@/components/RichTextEditor"


type CreateForumPost = components["schemas"]["CreateForumPostDto"];
type ForumTag = components["schemas"]["ForumPostTags"]
type ForumPost = components["schemas"]["ForumPostDto"];


type createForumPostProps = {
    tags: ForumTag[];
    onCancel: () => void;
    onSubmitSuccess?: (forumPost: ForumPost) => void;
}


export function CreateForumPost({ tags, onCancel, onSubmitSuccess }: createForumPostProps) {
    
    const [formData, setFormData] = useState<CreateForumPost>({
        title: "",
        text: "",
        subject: "",
        tag: "Help",
        username: ""
    })
    

    const url = "https://localhost:7035/ForumPost"

    const onCreateForumPostSubmit = async (forumPost: CreateForumPost) => {
        try {
            const data: ForumPost = await authFetch(url + "/CreateForumPost", {
                method: "POST",
                body: JSON.stringify(forumPost)
            });
            onSubmitSuccess?.(data);
        }
        catch (error) {
            console.log("Failed to fetch from forum post..." + error);
        }
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onCreateForumPostSubmit(formData);
    }

    useEffect(() => {
        const loadUserName = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                let finishedUsername = user?.user_metadata.username || "";

                if (!finishedUsername && user?.email) {
                    finishedUsername = user.email?.split("@");
                }

                setFormData(prev => ({
                    ...prev,
                    username: finishedUsername
                }))
            }
            catch (error) {
                console.log("could not find user..." + error);
            }
        };
        loadUserName();
    }, []);

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-slate-900">Create forum post</h1>
                <p className="mt-1 text-sm text-slate-500">Write a new post and publish it to the forum.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input type="text" onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required={true}></Input>
                </div>

                <div className="space-y-2">
                    <Label>Content</Label>
                    <RichTextEditor onChange={(value) => setFormData(prev => ({ ...prev, text: value }))} ></RichTextEditor>
                </div>

                <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input type="text" onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} required={true}></Input>
                </div>

                <div className="space-y-2">
                    <Label>Tag</Label>
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
                </div>

                <div className="flex gap-3 pt-2">
                    <Button className="bg-blue-500" type="submit">Save</Button>
                    <Button className="bg-red-500" type="button" onClick={onCancel}>Cancel</Button>
                </div>
            </form>
        </div>
    )
}