import { useState } from "react";
import type { components } from "../../types/schema";

type Spool = components["schemas"]["Spool"];

type AddSpoolFormProps = {
    onSubmit: (spool: Spool) => Promise<void>;
}

export const AddSpoolForm = ({ onSubmit }: AddSpoolFormProps) => {
    const [formData, setFormData] = useState<Spool>({
        brand: "",
        material: "",
        color: "",
        totalWeight: 0,
        spoolCost: 0
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: name === "totalWeight" || name === "cost" ? parseFloat(value) : value }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(formData);
    }

    return (
        <div>
            <h1>Add a New Spool</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Spool Brand:
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Material: 
                    <input type="text" name="material" value={formData.material} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Color:
                    <input type="text" name="color" value={formData.color} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Total Weight:
                    <input type="number" name="totalWeight" value={formData.totalWeight} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Cost: 
                    <input type="number" name="cost" step="10" value={formData.cost} onChange={handleChange} />
                </label>
                <br />
                <button type="submit">Create Spool</button>
            </form>
        </div>
    )
}
