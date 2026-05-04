import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useState, useEffect } from "react"

type Props = {
    onChange: (html: string) => void
    placeholder?: string
    initialContent?: string
}

export function RichTextEditor({ onChange, placeholder, initialContent }: Props) {
    const [, setUpdateCount] = useState(0);

    const editor = useEditor({
        extensions: [StarterKit],
        content: initialContent ?? "",
        editorProps: {
            attributes: {
                class: "forum-rich-text min-h-[120px] p-3 focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        onTransaction: () => setUpdateCount(prev => prev + 1),
    })

    useEffect(() => {
        if (!editor) return;
        const next = initialContent ?? "";
        if (editor.getHTML() !== next) {
            editor.commands.setContent(next);
        }
    }, [editor, initialContent]);

    return (
        <div className="rounded border bg-white">
            <div className="flex gap-1 border-b p-1 bg-gray-50">
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-2 py-1 rounded text-sm font-bold bg-gray-50 ${editor?.isActive("bold") ? "bg-green-200" : "hover:bg-gray-200"}`}
                >B</button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-2 py-1 rounded text-sm italic bg-gray-50 ${editor?.isActive("italic") ? "bg-green-200" : "hover:bg-gray-200"}`}
                >I</button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`px-2 py-1 rounded text-sm bg-gray-50 ${editor?.isActive("bulletList") ? "bg-green-200" : "hover:bg-gray-200"}`}
                >• List</button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    className={`px-2 py-1 rounded text-sm bg-gray-50 ${editor?.isActive("blockquote") ? "bg-green-200" : "hover:bg-gray-200"}`}
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
