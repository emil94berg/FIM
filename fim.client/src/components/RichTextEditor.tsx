import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

type Props = {
    onChange: (html: string) => void
    placeholder?: string
}

export function RichTextEditor({ onChange, placeholder }: Props) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        editorProps: {
            attributes: {
                class: "forum-rich-text min-h-[120px] p-3 focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    })

    return (
        <div className="rounded border bg-white">
            <div className="flex gap-1 border-b p-1 bg-gray-50">
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-2 py-1 rounded text-sm font-bold bg-transparent ${editor?.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-200"}`}
                >B</button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-2 py-1 rounded text-sm italic bg-transparent ${editor?.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-200"}`}
                >I</button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`px-2 py-1 rounded text-sm bg-transparent ${editor?.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-200"}`}
                >• List</button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    className={`px-2 py-1 rounded text-sm bg-transparent ${editor?.isActive("blockquote") ? "bg-gray-200" : "hover:bg-gray-200"}`}
                >❝</button>
            </div>
            {!editor?.getText() && placeholder && (
                <p className="pointer-events-none absolute p-3 text-sm text-muted-foreground">{placeholder}</p>
            )}
            <div className="relative">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
