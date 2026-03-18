import type { components } from "../../types/schema"
import { useState, useEffect } from "react";


type Print = components["schemas"]["Print"];
type Spool = components["schemas"]["Spool"];

type EditPrintFormProps = {
    print: Print;
    onSubmit: (print: Print) => Promise<void>;
    onCancel: () => void;
}

export const EditPrintForm = ({ print, onSubmit, onCancel }: EditPrintFormProps) => {
    const [formData, setFormData] = useState(print);
    const [allSpools, setAllSpools] = useState<Spool[]>([]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    }
    
    const statusMap: Record<number, string> = {
        0: "Pending",
        1: "Printing",
        2: "Done",
        3: "Failed"
    }

    useEffect(() => {
        const loadSpools = async () => {
            const response = await fetch("https://localhost:7035/Spool");
            if (!response) throw new Error("Failed to fetch from spool");
            const data: Spool[] = await response.json();
            setAllSpools(data);
        };
        loadSpools();
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <div>
            <label>Name: </label>
                <input
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                ></input>
            </div>
            <div>
            <label>Status: </label>
                <select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({
                        ...prev,
                        status: Number(e.target.value)
                    }))}
                >
                    {Object.entries(statusMap).map(([key, value]) => (
                        <option key={key} value={Number(key)}>{ value}</option>
                    ))}
                </select>
            </div>
            <div>
            <label>Spool: </label>
                <select
                    value={formData.spoolId}
                    onChange={e => setFormData(prev => ({ ...prev, spoolId: e.target.value }))}
                >
                    <option value={0}>-- Select Spool --</option>
                    {allSpools.map(s => (
                        <option key={s.id} value={s.id}>{s.brand}, {s.color}, {s.material}</option>
                    )
                    )}
                </select>
            </div>
            <div>
            <label>Grams used: </label>
                <input
                    value={formData.gramsUsed}
                    onChange={e => setFormData(prev => ({ ...prev, gramsUsed: e.target.value }))}
                ></input>
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel} >Cancel</button>
        </form>
    )

}