import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { components } from "@/types/schema"
import { ConfirmDialog } from "@/components/popUp/ConfirmPopup"
import { useState } from "react";

type Spool = components["schemas"]["SpoolDto"];
type GroupedSpool = components["schemas"]["SpoolGroupDto"]; 
type AllSpoolsGroupedProps = {
    groupedSpools: GroupedSpool[]
}


export function AllSpoolsGrouped({ groupedSpools }: AllSpoolsGroupedProps)  {
    

    return (






        <Table>
            <TableRow>
                <TableHeader>
                    <TableRow>
                        <TableHead>Identifier</TableHead>
                        <TableHead>Total weight</TableHead>
                    </TableRow>
                </TableHeader>
            </TableRow>
            <TableBody>
                {groupedSpools.map(gs => (
                    <TableRow key={gs.identifier}>
                        <TableCell>{gs.identifier}</TableCell>
                        {gs.spools.map(s => (
                            <TableCell key={s.id}>{s.brand}</TableCell>
                        ))}
                    </TableRow>
                ))}
               
            </TableBody>
        </Table>

    )
}