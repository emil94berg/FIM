import type { components } from "../types/schema" 
import { useState, useEffect } from "react";
/*import SideBar from "../Components/SidebarMenu";*/



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
    const [formData, setFormData] = useState({
        name: "",
        spoolId: 0,
        gramsUsed: 0,
        status: 0,
        createdAt: new Date()
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("https://localhost:7035/Print", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok)
                throw new Error("Failed to create print");

            const createdPrint: Print = await response.json();
            setPrint(prevPrints => [...prevPrints, createdPrint]);
        }
        catch (error) {
            console.error("Error creating print: ", error);
        }
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.currentTarget;
        setFormData(prev => ({
            ...prev,
            [name]: 
                name === "spoolId" ||
                name === "gramsUsed" ||
                name === "status" ? Number(value) : value
                   
        }));
    };
    const statusMap: Record<number, string> = {
        0: "Pending",
        1: "Printing",
        2: "Done",
        3: "Failed"
    }
    

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {/*<SideBar></SideBar>*/}
            {/*<div style={{ flexGrow: 1 }}>*/}
            {/*    {Print.map(p => p.name)}*/}
            {/*</div>*/}
            <table border={1}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Spool-Material</th>
                        <th>Grams Used</th>
                        <th>Status</th>
                        <th>Created at</th>
                    </tr>
                </thead>
                <tbody>
                    {Print.map(p => (
                        <tr key={ p.id }>
                            <td>{ p.name }</td>
                            <td>{ p.spool?.material }</td>
                            <td>{ p.gramsUsed }</td>
                            <td>{statusMap[p.status] }</td>
                            <td>{ p.createdAt }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Print Name: </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Spool: </label>
                    <input type="number" name="spoolId" value={formData.spoolId} onChange={handleChange} />
                </div>
                <div>
                    <label>Grams used: </label>
                    <input type="number" name="gramsUsed" value={formData.gramsUsed} onChange={handleChange} />
                </div>
                <div>
                    <label>Status: </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value={0}>Pending</option>
                        <option value={1}>Printing</option>
                        <option value={2}>Done</option>
                        <option value={3}>Failed</option>
                    </select>
                </div>
                <button type="submit">Create print</button>
            </form>
        </div>
    )
}