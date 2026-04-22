import type { components } from "@/types/schema"

type ForumPost = components["schemas"]["ForumPostDto"];

type DisplayPostProps = {
    post: ForumPost;
}

export function DisplayPost({ post }: DisplayPostProps) {
    const imgSource = "https://zjsclbapwgnhrslrmark.supabase.co/storage/v1/object/public/ProfilesImages/"
        + post.userId + "/profilepictures/avatar"






    return (
        <div className="mx-auto bg-blue-100 border rounded-xl mt-4" style={{maxWidth: "80%", textAlign: "center"} }>
            <h1 className="m-4">{post.title}</h1>
            <div className="bg-gray-100 m-2 p-2 border rounded-xl">
                <p>{post.text}</p>
                <img src={imgSource}></img>
            </div>
        </div>

    )
}