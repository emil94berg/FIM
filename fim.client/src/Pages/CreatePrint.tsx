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
    const [fromData, setFormData] = useState({
        name: "",
        spoolId: 0,
        gramsUsed: 0,
        status: "",
        createdAt: ""
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("https://localhost:7035/Print", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fromData)
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <SideBar></SideBar>
            <div style={{ flexGrow: 1 }}>
                {Print.map(p => p.name)}
            </div>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SpoolId</th>
                        <th>Grams Used</th>
                        <th>Status</th>
                        <th>Created at</th>
                    </tr>
                </thead>
                <tbody>
                    {Print.map(p => (
                        <tr key={ p.id }>
                            <td>{ p.name }</td>
                            <td>{ p.spoolId }</td>
                            <td>{ p.gramsUsed }</td>
                            <td>{ p.status }</td>
                            <td>{ p.createdAt }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Print Name: </label>
                    <input type="text" name="name" value={fromData.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Spool Id: </label>
                    <input type="number" name="spoolId" value={fromData.spoolId} onChange={handleChange} />
                </div>
                <div>
                    <label>Grams used: </label>
                    <input type="number" name="gramsUsed" value={fromData.gramsUsed} onChange={handleChange} />
                </div>
                <div>
                    <label>Status: </label>
                    <input type="text" name="status" value={fromData.status} onChange={handleChange} />
                </div>
                <div>
                    <label>Created at: </label>
                    <input type="date" name="createdAt" value={fromData.createdAt} onChange={handleChange} />
                </div>
                <button type="submit">Create print</button>
            </form>
        </div>
    )
}