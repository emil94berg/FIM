import { useLocation } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

type BreadcrumbsForumProps = {
    postTitle?: string
    postTag?: string | null
    activeTag?: string | null
    onClearTag?: () => void
}

export default function BreadcrumbsForum({ postTitle, postTag, activeTag, onClearTag }: BreadcrumbsForumProps) {
    const { pathname } = useLocation();
    const isCreate = pathname.includes("/forum/create");
    const isPost = pathname.startsWith("/forum/post/");
    const hasSubCrumb = isCreate || isPost || !!activeTag;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                {hasSubCrumb ? (
                    isCreate || isPost
                        ? <BreadcrumbLink href="/forum">Forum Home</BreadcrumbLink>
                        : <BreadcrumbLink className="cursor-pointer" onClick={onClearTag}>Forum Home</BreadcrumbLink>
                ) : (
                    <BreadcrumbPage></BreadcrumbPage>
                )}
                </BreadcrumbItem>

                {activeTag && !isCreate && !isPost && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{activeTag}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}

                {isCreate && (
                    <> 
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Create Post</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}

                {isPost && postTag && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/forum?tag=${postTag}`}>{postTag}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                )}

                {isPost && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{postTitle || "Post"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}