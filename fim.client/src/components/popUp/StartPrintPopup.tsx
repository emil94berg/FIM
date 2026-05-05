import { useState } from "react"
import type { components } from "src/types/schema"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { authFetch } from "../../auth/authFetch";
import { Button } from "../ui/button";
import { toast } from "sonner";

type Print = components["schemas"]["PrintDto"];

type StartPrintPopupPropts = {
    children: React.ReactNode
    print: Print
    onStarted: (updatedPrint: Print) => void
}

export function StartPrintPopup({
    print,
    children,
    onStarted,
}: StartPrintPopupPropts) { 
    const [estimatedTime, setEstimatedTime] = useState<number>(0);

    const startPrint = async (print: Print) => {
        try {
            const data = await authFetch(`https://localhost:7035/Print/StartPrint`, {
                method: "POST",
                body: JSON.stringify({
                    id: print.id,
                    estimatedTime: estimatedTime
                })
            });
            onStarted(data);
            toast.success(`Print "${print.name}" started`);
        }
        catch (error) {
            console.log("Failed to fetch from print..." + error);
            toast.error("Failed to start print");
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-white text-black sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Start print</DialogTitle>
                    <DialogDescription>Start print {print.name}</DialogDescription>
                </DialogHeader>
                <Label>Estimated print time (minutes):</Label>
                <Input type="number" placeholder="e.g. 120" onChange={(e) => setEstimatedTime(Number(e.target.value))}></Input>
                <DialogFooter>
                    <Button  className="bg-blue-500 text-black" onClick={() => startPrint(print)}>Start {print.name}</Button>
                    <DialogClose asChild>
                        <Button className="bg-transparent border border-gray-300 text-gray-700">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
    
}