import { Button } from "@/components/ui/button"
import type { components } from "../types/schema" 
import { useState, useEffect } from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle, } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"
import { authFetch } from "../auth/authFetch"
import DashCard from "@/components/DashboardCard"
import PrintsChart from "@/components/BarChart"

type PrintDto = components["schemas"]["PrintDto"];
type SpoolDto = components["schemas"]["SpoolDto"];

export default function DashboardHome() {
    const [pendingPrints, setPendinPrints] = useState<PrintDto[]>([]);
    const [allLowSpools, setAllLowSpools] = useState<SpoolDto[]>([]);
    const [printingPrints, setPrintingPrints] = useState<PrintDto[]>([]);


    useEffect(() => {
        const loadPendingPrints = async () => {
            try {
                const data: PrintDto[] = await authFetch(`https://localhost:7035/Print/pending`);
                setPendinPrints(data);
            }
            catch(error) {
                console.error("Error fetching data: " + error);
            }
        };
        loadPendingPrints();
    }, []);

    useEffect(() => {
        const loadAllSpools = async () => {
            try {
                const data: SpoolDto[] = await authFetch('https://localhost:7035/Spool/GetLowSpools');
                setAllLowSpools(data);
            }
            catch (error) {
                console.log("Failed to fetch" + error)
            }
        };
        loadAllSpools();
    }, []);

    useEffect(() => {
        const loadPrintingPrints = async () => {
            try {
                const data: PrintDto[] = await authFetch(`https://localhost:7035/Print/printing`);
                setPrintingPrints(data);
            }
            catch (error) {
                console.log("Failed to fetch: " + error);
            }
        };
        loadPrintingPrints();
    }, []);




    return (
        <div className="flex flex-col h-screen p-4">
            <div className="max-w-full">
                <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-3x1 font-bold">Dashboard</h1>
                    <Input placeholder="Search" type="search" id="input-field-search" ></Input>
                </div>
                
            </div>
            {/*<div className="flex-1 border"></div>*/}
            {/*<div className="flex-1 p-4">*/}
                <div className="grid grid-cols-3 gap-10">
                    <DashCard<PrintDto>
                        title="Pending prints"
                        items={pendingPrints}
                        typeName="prints"
                        renderItem={(p) => (
                            <p className="text-xl" >
                                {p.name}, {new Date(p.createdAt).toLocaleString("sv-SE", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>
                        )}
                    ></DashCard>
                    <DashCard<SpoolDto>
                        title="Low spools"
                        items={allLowSpools}
                        typeName="spools"
                        renderItem={(s) => <p className="text-xl" >{s.brand} {s.material} {s.color}</p>}
                    ></DashCard>
                    <DashCard
                        title="Live prints"
                        items={printingPrints}
                        typeName="prints"
                        renderItem={(p) => <p className="text-xl">{ p.name}</p> }
                    ></DashCard>
                </div>          
            {/*    </div>*/}
            <PrintsChart></PrintsChart>
        </div>

    )

}
