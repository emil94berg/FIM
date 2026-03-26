import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { components } from "../../types/schema";
import { ColorCheckBox } from "@/components/ColorPickerComponent"


type CreateSpoolDto = components["schemas"]["CreateSpoolDto"];

type AddSpoolFormProps = {
    onSubmit: (spool: CreateSpoolDto) => Promise<void>;
}

export const AddSpoolForm = ({ onSubmit }: AddSpoolFormProps) => {
    const [formData, setFormData] = useState<CreateSpoolDto>({
        brand: "",
        material: "",
        colorName: "",
        diameter: 1.75,
        totalWeight: 0,
        spoolCost: 0,
        bedTemp: 0,
        colorHex: "",
        colorHexes: [],
        extruderTemp: 0,
        finish: "",
        glow: false,
        translucent: false
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]:
                type === "checkbox" ?
                    checked :
                name === "totalWeight" ||
                name === "spoolCost" ||
                name === "diameter" || 
                name === "extruderTemp" ||
                name === "bedTemp"
                ? value === "" ? null : parseFloat(value) : value
        }));
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
                    Color name:
                    <Input type="text" name="colorName" value={formData.colorName} onChange={handleChange} />
                </Label>
                <ColorCheckBox formData={formData} setFormData={setFormData}></ColorCheckBox>
                <Label>
                    Diameter (mm):
                    <Input type="number" name="diameter" step="0.01" value={formData.diameter} onChange={handleChange} />
                </Label>
                <Label>
                    Total Weight:
                    <Input type="number" name="totalWeight" value={formData.totalWeight} onChange={handleChange} />
                </Label>
                <Label>
                    Extruder temp:
                    <Input type="number" name="extruderTemp" value={formData.extruderTemp ?? ""} onChange={handleChange} />
                </Label>
                <Label>
                    Bed temp:
                    <Input type="number" name="bedTemp" value={formData.bedTemp ?? ""} onChange={handleChange} />
                </Label>
                <Label>
                    Glow:
                    <Input className="bg-transparent" type="checkbox" name="glow" checked={formData.glow} onChange={handleChange} />
                </Label>
                <Label>
                    Translucent:
                    <Input className="bg-transparent" type="checkbox" name="translucent" checked={formData.translucent} onChange={handleChange} />
                </Label>
                <Label>
                    Finish:
                    <Input type="text" name="finish" value={formData.finish ?? ""} onChange={handleChange} />
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
