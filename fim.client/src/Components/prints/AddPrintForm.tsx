import type { components } from "../../types/schema"
import { useState, useEffect } from "react";
/*import SideBar from "../Components/SidebarMenu";*/



type Print = components["schemas"]["Print"];
type Spool = components["schemas"]["Spool"];

type AddPrintFormProps = {
    onSubmit: (print: Print) => Promise<void>;
}



export const AddPrintForm = ({ onSubmit }: AddPrintFormProps) => {
    
    const [Spool, setSpools] = useState<Spool[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        spoolId: 0,
        gramsUsed: 0,
        status: 0,
        createdAt: new Date().toISOString()
    });

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

    useEffect(() => {
        const loadSpools = async () => {
            try {
                const response = await fetch("https://localhost:7035/Spool")
                if (!response.ok) throw new Error("Failed to fetch from Spool")
                const data: Spool[] = await response.json();
                setSpools(data);
                console.log(data);
            }
            catch (error) {
                console.error(error);
            }
        };
        loadSpools();
    }, []);

    const statusMap: Record<number, string> = {
        0: "Pending",
        1: "Printing",
        2: "Done",
        3: "Failed"
    }
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(formData);
    }


    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Print Name: </label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
                <label>Spool: </label>
                {/*<input type="number" name="spoolId" value={formData.spoolId} onChange={handleChange} />*/}
                <select name="spoolId" value={formData.spoolId} onChange={handleChange}>
                    <option value={0}>-- Select Spool --</option>
                    {Spool.map(s => (
                        <option key={s.id} value={s.id}>{s.brand}, {s.color}, {s.material}</option>
                    ))}
                </select>
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
                    {Object.entries(statusMap).map(([key, value]) => (
                        <option key={key} value={ Number(key)}>
                            { value}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Create print</button>
        </form>
    )
}

    




