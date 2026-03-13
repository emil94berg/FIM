import type { components } from "../types/schema" 
import { useState, useEffect } from "react";
import SideBar from "../Components/SidebarMenu";



type Print = components["schemas"]["Print"];    

export default function CreatePrint() {
    const [Print, setPrint] = useState<Print[]>([]);
    
    useEffect(() => {
        const loadPrint = async () => {
            try {
                const response = await fetch("https://localhost:7035/Print")
                if (!response.ok) throw new Error("Failed to fetch from Print API");
                const data: Print[] = await response.json();
                setPrint(data);
            }
            catch (error) {
                console.error("Error fetching print: ", error);
            }
        };
        loadPrint();
    }, []);
    
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <SideBar></SideBar>
            <div style={{ flexGrow: 1 }}>
                {Print.map(p => p.name)}
            </div>
        </div>
    )
}