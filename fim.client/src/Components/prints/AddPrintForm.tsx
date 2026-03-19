import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { components } from "../../types/schema"
import { useState, useEffect } from "react";
import { authFetch } from "@/auth/authFetch"
/*import SideBar from "../components/SidebarMenu";*/



type Print = components["schemas"]["CreatePrintDto"];
type Spool = components["schemas"]["Spool"];

type AddPrintFormProps = {
    onSubmit: (print: Print) => Promise<void>;
}



export const AddPrintForm = ({ onSubmit }: AddPrintFormProps) => {
    
    const [Spool, setSpools] = useState<Spool[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        spoolId: 0,
        gramsUsed: 0,
        status: 0
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.currentTarget;
        setFormData(prev => ({
            ...prev,
            [name]:
                name === "spoolId" ||
                    name === "gramsUsed" ||
                    name === "status" ? Number(value) : value

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

    const statusMap: Record<number, string> = {
        0: "Pending",
        1: "Printing",
        2: "Done",
        3: "Failed"
    }
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(formData);
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
                <Label>Print Name: </Label>
                <Input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="SpoolId">Spool: </Label>
                <Select
                    value={String(formData.spoolId)}
                    onValueChange={(value) => 
                        setFormData(prev => ({
                            ...prev, spoolId: Number(value)
                        }))}
                    name="SpoolId"
                        
                >
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select a spool"></SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md">
                        <SelectGroup>
                            <SelectLabel>Spools</SelectLabel>
                            {Spool.map(s => (
                                <SelectItem key={s.id} value={String(s.id)}>{s.brand}, {s.material}, {s.color}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-1">
                <label>Grams used: </label>
                <Input type="number" name="gramsUsed" value={formData.gramsUsed} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="Status">Status: </Label>
                <Select value={String(formData.status)}
                    onValueChange={(value) =>
                        setFormData(prev => ({
                            ...prev, status: Number(value)
                        }))}
                    name="Status"
                >
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select a status"></SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md">
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            {Object.entries(statusMap).map(([key, value]) => (
                                <SelectItem key={key} value={String(key)}>{value}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Button className="bg-blue-500 text-black" variant="ghost" type="submit">Create print</Button>
        </form>
    )
}

    




