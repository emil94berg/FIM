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




type Print = components["schemas"]["PrintDto"]

export function HandleDeletedPrints() {
    const [deletedPrints, setDeletedPrints] = useState<Print[]>([]);

    useEffect(() => {
        const loadPrints = async () => {
            try {
                const data = await authFetch(`https://localhost:7035/Print`)
                setDeletedPrints(data);
            }
            catch (error) {
                console.log("Failed to fetch from Prints..." + error);
            }
        };
        loadPrints();
    }, []);

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
                            <TableCell>Knappar</TableCell>
                        </TableRow>
                        ))}
                </TableBody>
            </Table>

        </div>
    )













}