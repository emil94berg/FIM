import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
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
            <form onSubmit={handleSubmit} className="space-y-4">
                <Label>
                    Spool Brand:
                    <Input type="text" name="brand" value={formData.brand} onChange={handleChange} />
                </Label>
                <Label>
                    Material: 
                    <Input type="text" name="material" value={formData.material} onChange={handleChange} />
                </Label>
                <Label>
                    Color:
                    <Input type="text" name="color" value={formData.color} onChange={handleChange} />
                </Label>
                <Label>
                    Diameter (mm):
                    <Input type="number" name="diameter" step="0.01" value={formData.diameter} onChange={handleChange} />
                </Label>
                <Label>
                    Total Weight:
                    <Input type="number" name="totalWeight" value={formData.totalWeight} onChange={handleChange} />
                </Label>
                <Label>
                    Cost: 
                    <Input type="number" name="spoolCost" step="10" value={formData.spoolCost} onChange={handleChange} />
                </Label>
                <Button className="bg-blue-500 text-black" type="submit">Create Spool</Button>
            </form>
        </div>
    )
}
