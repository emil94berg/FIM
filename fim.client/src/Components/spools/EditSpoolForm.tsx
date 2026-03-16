import { useState } from "react";
import type { components } from "../../types/schema";

type Spool = components["schemas"]["Spool"];

type EditSpoolFormProps = {
    spool: Spool;
    onSubmit: (id: number | string, updated: Partial<Spool>) => Promise<void>;
    onCancel: () => void;
}

export const EditSpoolForm = ({ spool, onSubmit, onCancel }: EditSpoolFormProps) => {
    const [formData, setFormData] = useState<Spool>({ ... spool });

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev,
            [name]: name === "totalWeight" || name === "spoolCost" || name === "diameter" ? parseFloat(value) : value }));
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const changed: Partial<Spool> = {};
        if (formData.brand !== spool.brand) changed.brand = formData.brand;
        if (formData.material !== spool.material) changed.material = formData.material;
        if (formData.color !== spool.color) changed.color = formData.color;
        if (formData.diameter !== spool.diameter) changed.diameter = formData.diameter;
        if (formData.totalWeight !== spool.totalWeight) changed.totalWeight = formData.totalWeight;
        if (formData.spoolCost !== spool.spoolCost) changed.spoolCost = formData.spoolCost;
        await onSubmit(spool.id!, changed);
    }

    return (
        <div>
            <h2>Edit Spool</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Spool Brand:
                    <input type="text" name="brand" value={formData.brand} onChange={handelChange} />
                </label>
                <br/>
                <label>
                    Spool Material:
                    <input type="text" name="material" value={formData.material} onChange={handelChange} />
                </label>
                <br/>
                <label>
                    Spool Color:
                    <input type="text" name="color" value={formData.color} onChange={handelChange} />
                </label>
                <br/>
                <label>
                    Spool Diameter:
                    <input type="number" name="diameter" value={formData.diameter} onChange={handelChange} />
                </label>
                <br/>
                <label>
                    Total Weight:
                    <input type="number" name="totalWeight" value={formData.totalWeight} onChange={handelChange} />
                </label>
                <br/>
                <label>
                    Spool Cost:
                    <input type="number" name="spoolCost" value={formData.spoolCost} onChange={handelChange} />
                </label>
                <br/>
                <button type="submit">Update Spool</button>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </form>
        </div>
    )
}