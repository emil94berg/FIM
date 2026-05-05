import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { components } from "../../types/schema"
import { useState, useEffect } from "react";
import { authFetch } from "@/auth/authFetch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"



type Print = components["schemas"]["CreatePrintDto"];
type Spool = components["schemas"]["Spool"];

type AddPrintFormProps = {
    onSubmit: (print: Print) => Promise<void>;
    onCancel: () => void;
}

export const AddPrintForm = ({ onSubmit, onCancel }: AddPrintFormProps) => {
    
    const [Spool, setSpools] = useState<Spool[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        spoolId: 0,
        gramsUsed: 0,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.currentTarget;
        setFormData(prev => ({
            ...prev,
            [name]:
                name === "spoolId" ||
                    name === "gramsUsed" ? Number(value) : value

        }));
    };

    useEffect(() => {
        const loadSpools = async () => {
            try {
                const data:Spool[] = await authFetch("https://localhost:7035/Spool")
                setSpools(data);
            }
            catch (error) {
                console.error(error);
            }
        };
        loadSpools();
    }, []);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(formData);
        onCancel();
    }


    return (
        <Dialog open onOpenChange={(open) => {
            if (!open) onCancel();
        }}>
            <DialogContent className="bg-white sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add a New Print</DialogTitle>
                    <DialogDescription>Fill out the details of the print below.</DialogDescription>
                </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 min-w-0">
                        <div className="flex flex-col gap-1">
                            <Label>Print Name: </Label>
                            <Input type="text" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                            <Label htmlFor="SpoolId">Spool: </Label>
                            <Select
                                value={String(formData.spoolId)}
                                onValueChange={(value) =>
                                    setFormData(prev => ({
                                        ...prev, spoolId: Number(value)
                                    }))}
                                name="SpoolId"

                            >
                                <SelectTrigger className="max-w-full min-w-0">
                                    <SelectValue placeholder="Select a spool"></SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-white border shadow-md">
                                    <SelectGroup>
                                        <SelectLabel>Spools</SelectLabel>
                                        {Spool.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                <span className="block max-w-full truncate">
                                                {s.brand}, {s.material}, {s.colorName}, {s.diameter}mm, {s.remainingWeight}g left
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Grams used: </label>
                            <Input type="number" name="gramsUsed" value={formData.gramsUsed} onChange={handleChange} />
                        </div>
                        <DialogFooter>
                            <Button className="bg-blue-500 text-white" variant="ghost" type="submit">Create print</Button>
                            <Button className="bg-transparent border border-gray-300 text-gray-700" type="button" onClick={onCancel}>Cancel</Button>
                        </DialogFooter>
                    </form>
            </DialogContent>
        </Dialog> 
    )
}

    




