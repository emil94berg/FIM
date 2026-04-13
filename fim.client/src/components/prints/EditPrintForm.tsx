import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
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

    const [formData, setFormData] = useState<Print & { estimatedMinutes?: number }>(print);
    const showTimeInput = Number(formData.status) === 1 && Number(print.status) !== 1;


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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
                <Label>Name: </Label>
                <Input
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                ></Input>
            </div>
            <div className="flex flex-col gap-1">
                <Label>Status: </Label>
                <Select
                    value={String(formData.status)}
                    onValueChange={(value) =>
                        setFormData(prev => ({
                            ...prev, status: Number(value)
                        }))}
                    name="Status"

                >
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Status"></SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md">
                        <SelectGroup>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                {Object.entries(statusMap).map(([key, value]) => (
                                    <SelectItem key={key} value={String(key)}>{value}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="spoolId">Spool: </Label>
                <Select
                    value={String(formData.spoolId)}
                    onValueChange={(value) =>
                        setFormData(prev => ({
                            ...prev, spoolId: Number(value)
                        }))}
                    name="spoolId"
                >
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select a spool"></SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md">
                        <SelectGroup>
                            <SelectLabel>Spools</SelectLabel>
                            {allSpools.map(s => (
                                <SelectItem key={s.id} value={String(s.id)}>{s.brand}, {s.material}, {s.colorName}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-1">
                <Label>Grams used: </Label>
                <Input
                    value={formData.gramsUsed}
                    onChange={e => setFormData(prev => ({ ...prev, gramsUsed: Number(e.target.value) }))}
                ></Input>
            </div>
            {showTimeInput && (
                <div className="flex flex-col gap-1">
                    <Label>Estimated print time (minutes): </Label>
                    <Input
                        type="number"
                        min={1}
                        value={formData.estimatedMinutes ?? ""}
                        onChange={e => setFormData(prev => ({ ...prev, estimatedMinutes: Number(e.target.value) }))}
                        placeholder="e.g. 120"
                    />
                </div>
            )}
            <Button className="bg-blue-500 text-black" type="submit">Save</Button>
            <Button className="bg-red-500 text-white" type="button" onClick={onCancel} >Cancel</Button>
        </form>
    )

}