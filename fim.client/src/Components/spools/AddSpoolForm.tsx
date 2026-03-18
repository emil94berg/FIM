import { useState } from "react";
import type { components } from "../../types/schema";

type CreateSpoolDto = components["schemas"]["CreateSpoolDto"];

type AddSpoolFormProps = {
    onSubmit: (spool: CreateSpoolDto) => Promise<void>;
}

export const AddSpoolForm = ({ onSubmit }: AddSpoolFormProps) => {
    const [formData, setFormData] = useState<CreateSpoolDto>({
        brand: "",
        material: "",
        color: "",
        diameter: 1.75,
        totalWeight: 0,
        spoolCost: 0
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: name === "totalWeight" || name === "spoolCost" || name === "diameter" ? parseFloat(value) : value }));
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
                    Diameter (mm):
                    <input type="number" name="diameter" step="0.01" value={formData.diameter} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Total Weight:
                    <input type="number" name="totalWeight" value={formData.totalWeight} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Cost: 
                    <input type="number" name="spoolCost" step="10" value={formData.spoolCost} onChange={handleChange} />
                </label>
                <br />
                <button type="submit">Create Spool</button>
            </form>
        </div>
    )
}
