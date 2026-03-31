import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


type CancelPrintProps = {
    onConfirm: (grams: number) => void
}


export function CancelPrint({
    onConfirm
}: CancelPrintProps) {

    const [gramsUsed, setGramsUsed] = useState<number>(0);

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger className="bg-transparent" asChild>
                    <Button className="bg-blue-500 text-white">Cancel Print</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Print</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to cancel print?</AlertDialogDescription>
                    </AlertDialogHeader>
                        <Label htmlFor="gramsUsed">Grams used before cancel?</Label>
                        <Input type="number" id="gramsUsed" placeholder="Grams used" onChange={(e) => setGramsUsed(Number(e.target.value))}></Input>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-blue-500 text-white" onClick={() => onConfirm(gramsUsed)}>Cancel Print</AlertDialogAction>
                        <AlertDialogCancel className="bg-red-500 text-black">Back</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>


    )
}