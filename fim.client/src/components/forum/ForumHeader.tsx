import type { components } from "@/types/schema"






export function ForumHeader() {

    return (
        <div style={{ width: "100%", border: "2px solid lightgray", borderRadius: "10px", backgroundColor: "rgba(0,0,0,0.1)" }}>
            <div style={{ maxWidth:"800px", margin:"0 auto", padding: "20px", textAlign: "center"}}>
                <h1>Welcome to the Forum page</h1>
                <ul style={{ display: "flex", justifyContent: "center", gap: "16px", listStyle: "none", padding: 0 }}>
                        <li>Ämne1</li>
                        <li>Ämne2</li>
                        <li>Ämne3</li>
                    </ul>
            </div>
        </div>
    )
}