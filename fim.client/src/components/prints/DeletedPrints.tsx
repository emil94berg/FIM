import type { components } from "@/types/schema"
import { useState, useEffect } from "react"
import { authFetch } from "@/auth/authFetch"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"

type Print = components["schemas"]["PrintDto"]


type DeletePrintProps = {
    setPrint: React.Dispatch<React.SetStateAction<Print[]>>
    /*onActivate: (id: string) => void;*/
}


export function HandleDeletedPrints({ setPrint }: DeletePrintProps) {
    const [deletedPrints, setDeletedPrints] = useState<Print[]>([]);

    useEffect(() => {
        const loadPrints = async () => {
            try {
                const data = await authFetch(`https://localhost:7035/Print/GetAllDeletedPrints`)
                setDeletedPrints(data);
            }
            catch (error) {
                console.log("Failed to fetch from Prints..." + error);
            }
        };
        loadPrints();
    }, []);

    const deleteToActiveAsync = async (print: Print) => {
        try {
            const data = await authFetch(`https://localhost:7035/Print/UpdateStatus`, {
                method: "POST",
                body: JSON.stringify({
                    Id: print.id,
                    Status: print.status
                })
            })
            if (data !== null) {
                setDeletedPrints(prev => prev.filter(p => p.id !== data.id));
                setPrint(prev => [...prev, data]);
            }
        }
        catch (error) {
            console.log("Could not fetch from Print... " + error);
        }
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Created at</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {deletedPrints.map(p => (
                        <TableRow>
                            <TableCell>{ p.name}</TableCell>
                            <TableCell>{ p.createdAt}</TableCell>
                            <TableCell>
                                <Button className="bg-blue-500 text-black"
                                    onClick={() => deleteToActiveAsync(p)} 
                                >Activate</Button>
                            </TableCell>
                        </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    )













}