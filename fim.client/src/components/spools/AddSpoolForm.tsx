import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import type { components } from "../../types/schema";
import { ColorCheckBox } from "@/components/ColorPickerComponent"
import { ExistingSpoolContext, defaultSpool } from "@/components/context/AddSpoolContextType"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"


type CreateSpoolDto = components["schemas"]["CreateSpoolDto"];

type AddSpoolFormProps = {
    onSubmit: (spool: CreateSpoolDto) => Promise<void>;
    onCancel: () => void;
}

export const AddSpoolForm = ({ onSubmit, onCancel }: AddSpoolFormProps) => {
    const { formData, setFormData } = useContext(ExistingSpoolContext)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => {
            return {
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
        }});
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(formData);
        setFormData(defaultSpool);
        onCancel();
    }

    return (
        <Dialog open onOpenChange={(open) => {
            if (!open) onCancel();
        }}>
            <DialogContent className="bg-white sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add a New Spool</DialogTitle>
                    <DialogDescription>Fill out the details of the spool below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Label>
                        Spool Brand:
                        <Input type="text" name="brand" value={formData?.brand} onChange={handleChange} />
                    </Label>
                    <Label>
                        Material: 
                        <Input type="text" name="material" value={formData?.material} onChange={handleChange} />
                    </Label>
                    <Label>
                        Color name:
                        <Input type="text" name="colorName" value={formData?.colorName} onChange={handleChange} />
                    </Label>
                    <ColorCheckBox formData={formData} setFormData={setFormData}></ColorCheckBox>
                    <Label>
                        Diameter (mm):
                        <Input type="number" name="diameter" step="0.01" value={formData?.diameter} onChange={handleChange} />
                    </Label>
                    <Label>
                        Total Weight:
                        <Input type="number" name="totalWeight" value={formData?.totalWeight} onChange={handleChange} />
                    </Label>
                    <Label>
                        Extruder temp:
                        <Input type="number" name="extruderTemp" value={formData?.extruderTemp ?? ""} onChange={handleChange} />
                    </Label>
                    <Label>
                        Bed temp:
                        <Input type="number" name="bedTemp" value={formData?.bedTemp ?? ""} onChange={handleChange} />
                    </Label>
                    <Label>
                        Glow:
                        <Input className="bg-transparent" type="checkbox" name="glow" checked={formData?.glow} onChange={handleChange} />
                    </Label>
                    <Label>
                        Translucent:
                        <Input className="bg-transparent" type="checkbox" name="translucent" checked={formData?.translucent} onChange={handleChange} />
                    </Label>
                    <Label>
                        Finish:
                        <Input type="text" name="finish" value={formData?.finish ?? ""} onChange={handleChange} />
                    </Label>
                    <Label>
                        Cost: 
                        <Input type="number" name="spoolCost" step="10" value={formData?.spoolCost} onChange={handleChange} />
                    </Label>
                    <DialogFooter>
                        <Button className="bg-blue-500 text-white" type="submit">Create Spool</Button>
                        <Button className="bg-red-500 text-white" type="button" onClick={onCancel}>Cancel</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
