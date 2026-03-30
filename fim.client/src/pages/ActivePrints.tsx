import { useState, useEffect } from "react"
import type { components } from "src/types/schema"
import { authFetch } from "../auth/authFetch"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CancelPrint } from "@/components/popUp/CancelPrintPopup"

type Prints = components["schemas"]["PrintDto"];

export default function EditActivePrints() {
    const [activePrints, setActivePrints] = useState<Prints[]>([]);


    useEffect(() => {
        const loadActivePrints = async () => {
            try {
                const data = await authFetch(`https://localhost:7035/Print/GetActivePrints`);
                setActivePrints(data);
            }
            catch (error) {
                console.log("Failed to fetch from Prints: " + error);
            }
        }
        loadActivePrints();
    }, []);

    const UpdateGramsUsed = async (print: Prints, grams:number) => {
        try {
                await authFetch(`https://localhost:7035/Spool/UpdateSpoolWeight`, {
                method: "POST",
                    body: JSON.stringify({
                        GramsUsed: grams,
                        SpoolId: print.spoolId
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
            });
        }
        catch (error) {
            console.log("Failed to fetch from Spools " + error);
        }
    };

    const statusMap: Record<number, string> = {
        0: "Pending",
        1: "Printing",
        2: "Done",
        3: "Failed"
    }
   
    return (
        <div>
        <h1>Active Prints</h1>
            <Table border={1}>
                <TableHeader>
                <TableRow>
                    
                        <TableHead>Print Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                 
                    </TableRow>
                </TableHeader>
                <TableBody>
                        {activePrints.map(p => (
                            <TableRow>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{statusMap[p.status]}</TableCell>
                                <TableCell>
                                    <CancelPrint onConfirm={(grams: number) => UpdateGramsUsed(p, grams)}></CancelPrint>
                                </TableCell>
                            </TableRow>        
                        ))}
                </TableBody>
            </Table>
        </div>
    )
}

