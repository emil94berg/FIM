import { Button } from "@/components/ui/button"
import type { components } from "@/types/schema" 

type forumTag = components["schemas"]["ForumPostTags"];

type ForumHeaderProps = {
    tags: forumTag[],
    onDisplayPostOnForumTag: (tag: forumTag) => void
}



export function ForumHeader({ tags, onDisplayPostOnForumTag } : ForumHeaderProps) {
    
    

    return (
        <div className="w-full rounded-xl border border-slate-300 bg-slate-100">
            <div className="mx-auto max-w-4xl px-4 py-5 text-center">
                <h1 className="text-5xl font-semibold text-slate-900">Welcome to the Forum page</h1>
                <ul className="mt-4 flex flex-wrap justify-center gap-3 p-0">
                    {tags.map(tag =>
                        <li key={tag}>
                            <Button
                                onClick={() => onDisplayPostOnForumTag(tag)}
                                variant="outline"
                                className="cursor-pointer border-slate-400 bg-white px-4 py-2 text-slate-800 shadow-sm hover:border-slate-500 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-sky-500"
                            >
                                {tag}
                            </Button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}