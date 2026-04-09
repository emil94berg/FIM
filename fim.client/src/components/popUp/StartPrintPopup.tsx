import { useState } from "react"
import type { components } from "src/types/schema"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { authFetch } from "../../auth/authFetch";

type Print = components["schemas"]["PrintDto"];

type StartPrintPopupPropts = {
    children: React.ReactNode
    print: Print
}



export function StartPrintPopup({
    print,
    children
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
        }
        catch (error) {
            console.log("Failed to fetch from print..." + error);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white text-black">
                <AlertDialogHeader>
                    <AlertDialogTitle>Start print</AlertDialogTitle>
                    <AlertDialogDescription>Start print {print.name}</AlertDialogDescription>
                </AlertDialogHeader>
                <Label>Estimated print time (minutes):</Label>
                <Input type="number" placeholder="e.g. 120" onChange={(e) => setEstimatedTime(Number(e.target.value))}></Input>
                <AlertDialogFooter>
                    <AlertDialogAction  className="bg-blue-500 text-black" onClick={() => startPrint(print)}>Start {print.name}</AlertDialogAction>
                    <AlertDialogCancel className="bg-red-500 text-black" >Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
    
}