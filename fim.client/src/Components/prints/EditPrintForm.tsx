import type { components } from "../../types/schema"
import { useState, useEffect } from "react";
import { authFetch } from "@/auth/authFetch"


type Print = components["schemas"]["PrintDto"];
type Spool = components["schemas"]["SpoolDto"];

type EditPrintFormProps = {
    print: Print;
    onSubmit: (print: Print) => Promise<void>;
    onCancel: () => void;
}

export const EditPrintForm = ({ print, onSubmit, onCancel }: EditPrintFormProps) => {

    const [formData, setFormData] = useState<Print>(print);


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
            try {
                const data: Spool[] = await authFetch("https://localhost:7035/Spool")
                setAllSpools(data);
            }
            catch (error) {
                console.error(error);
            }
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