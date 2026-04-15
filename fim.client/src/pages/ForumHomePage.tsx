import type { components } from "@/types/schema"
import { authFetch } from "@/auth/authFetch"
import { useState, useEffect } from "react"
import { ForumHeader }  from "@/components/forum/ForumHeader" 

export default function ForumHomePage() {




    return (
        <div style={{ display: "flex" }}>
            <ForumHeader></ForumHeader>
        </div>
    )
}