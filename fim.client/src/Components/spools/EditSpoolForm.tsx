import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { components } from "../../types/schema";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

type Spool = components["schemas"]["SpoolDto"];

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
        if (formData.colorName !== spool.colorName) changed.colorName = formData.colorName;
        if (formData.diameter !== spool.diameter) changed.diameter = formData.diameter;
        if (formData.totalWeight !== spool.totalWeight) changed.totalWeight = formData.totalWeight;
        if (formData.spoolCost !== spool.spoolCost) changed.spoolCost = formData.spoolCost;
        await onSubmit(spool.id!, changed);
    }

    return (
        <Dialog open onOpenChange={(open) => {
            if (!open) onCancel();
        }}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Edit Spool</DialogTitle>
                    <DialogDescription>Make changes to the spool details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <Label>
                            Spool Brand:
                            <Input type="text" name="brand" value={formData.brand} onChange={handelChange} />
                        </Label>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>
                            Spool Material:
                            <Input type="text" name="material" value={formData.material} onChange={handelChange} />
                        </Label>
                    </div>
                    <div className="flex flex-col gap-1"> 
                        <Label>
                            Spool Color:
                            <Input type="text" name="colorName" value={formData.colorName} onChange={handelChange} />
                        </Label>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>
                            Spool Diameter:
                            <Input type="number" name="diameter" value={formData.diameter} onChange={handelChange} />
                        </Label>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>
                            Total Weight:
                            <Input type="number" name="totalWeight" value={formData.totalWeight} onChange={handelChange} />
                        </Label>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>
                            Spool Cost:
                            <Input type="number" name="spoolCost" value={formData.spoolCost} onChange={handelChange} />
                        </Label>
                    </div>
                    <DialogFooter>
                        <Button className="bg-blue-500 text-white" type="submit">Update Spool</Button>
                        <Button className="bg-red-500 text-white" type="button" onClick={onCancel}>Cancel</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}