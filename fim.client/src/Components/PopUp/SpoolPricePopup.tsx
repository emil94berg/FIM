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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"


type SpoolPriceProps = {
    warningtext?: string
    onConfirm: (price: number) => void
}


export function SetSpoolPrice({
    warningtext,
    onConfirm
}: SpoolPriceProps) {

    const [localPrice, setLocalPrice] = useState<number>(0);


    return (
        <AlertDialog>
            <AlertDialogTrigger className="bg-transparent">
                <Button variant="outline" className="bg-blue-500 text-yellow">Add to spools</Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-white text black">
                <AlertDialogHeader>
                    <AlertDialogTitle>Spool price</AlertDialogTitle>
                    <AlertDialogDescription>What is the purchase price?</AlertDialogDescription>
                </AlertDialogHeader>
                {warningtext !== "" ? (
                    <Label style={{ color: "red", fontSize:"18px" }}>{warningtext}</Label>
                ): (
                   null ) }
                <div className="py-4">
                    <Label htmlFor="spoolPrice">Spool price</Label>
                    <Input className="mt-2"
                        type="number"
                        onChange={(e) => setLocalPrice(Number(e.target.value))}
                        id="spoolPrice"
                        placeholder="Spool price">
                    </Input>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => {
                        onConfirm(localPrice);
                    }}
                        className="bg-blue-500 text white">
                        Set Price
                    </AlertDialogAction>
                    <AlertDialogCancel>"Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    
    )
}



