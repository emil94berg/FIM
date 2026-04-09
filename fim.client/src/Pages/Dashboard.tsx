import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { authFetch } from "../auth/authFetch";
import PrintsChart from "@/components/BarChart";
import { EditSpoolForm } from "@/components/spools/EditSpoolForm";
import { SpoolItem } from "@/components/dashboard/SpoolItem";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { Button } from "@/components/ui/button";
import type { components } from "@/types/schema";
import { Link } from "react-router-dom";
import { CompletedPrintsChart } from "@/components/dashboard/CompletedRadarChart"
import { ChartSpoolMaterialLeft } from "@/components/dashboard/ChartSpoolMaterialLeft";
import { ChartPrintOutcome } from "@/components/dashboard/ChartPrintOutcome";
import { CardTotalSpoolCost } from "@/components/dashboard/CardTotalSpoolCost";


type PrintDto = components["schemas"]["PrintDto"];
type SpoolDto = components["schemas"]["SpoolDto"];

export default function DashboardHome() {
    const [activeTab, setActiveTab] = useState("overview");
    
    const [data, setData] = useState({
        pending: [] as PrintDto[],
        printing: [] as PrintDto[],
        lowSpools: [] as SpoolDto[],
        allSpools: [] as SpoolDto[],
        allCompletedPrints: [] as PrintDto[]
    });


    const [searchString, setSearchString] = useState("");
    const [editingSpool, setEditingSpool] = useState<SpoolDto | null>(null);

    const fetchDashBoardData = async () => {
        const [pending, printing, low, all, prints ] = await Promise.all([
            authFetch(`https://localhost:7035/Print/pending`),
            authFetch(`https://localhost:7035/Print/printing`),
            authFetch('https://localhost:7035/Spool/GetLowSpools'),
            authFetch(`https://localhost:7035/spool`),
            authFetch(`https://localhost:7035/Print`)
        ]);
        return { pending, printing, lowSpools: low, allSpools: all, allCompletedPrints: prints };
    };

    useEffect(() => {
        const loadDashBoardData = async () => {
            try {
                const nextData = await fetchDashBoardData();
                setData(nextData);
            } catch (error) {
                console.error("Error loading dashboard data", error);
            }
        };

        void loadDashBoardData();
     }, []);

    const handleUpdateSpool = async (id: number | string, updated: Partial<SpoolDto>) => {
        try {
            await authFetch(`https://localhost:7035/spool/${id}`, {
                method: "PATCH",
                body: JSON.stringify(updated)
            });
            const nextData = await fetchDashBoardData();
            setData(nextData);
            setEditingSpool(null);
        } catch (error) {
            console.error("Error updating spool", error);
        }
    };

     const filteredSpools = data.allSpools.filter(s =>
        s.colorName.toLowerCase().includes(searchString.toLowerCase()) ||
        s.brand.toLowerCase().includes(searchString.toLowerCase()) ||
        s.material.toLowerCase().includes(searchString.toLowerCase())
    );
    return (
        <div className="flex flex-col h-screen p-4 gap-4 overflow-hidden"> 
            
            <div className="flex items-center">
                <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden w-full">
                <TabsList className="w-fit">
                    <TabsTrigger value="overview" className="bg-transparent">Overview</TabsTrigger>
                    <TabsTrigger value="inventory" className="bg-transparent">Inventory</TabsTrigger>
                    <TabsTrigger value="stats" className="bg-transparent">Statistics</TabsTrigger>
                    <TabsTrigger value="test" className="bg-transparent">Test</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="flex-1 overflow-auto mt-4">
                    <div className="mb-4 flex flex-wrap gap-2">
                        <Button asChild variant="outline" className="border-slate-200 bg-white hover:bg-slate-50">
                            <Link to="/create-print">Create Print</Link>
                        </Button>
                        <Button asChild variant="outline" className="border-slate-200 bg-white hover:bg-slate-50">
                            <Link to="/activePrints">Active Prints</Link>
                        </Button>
                    </div>

                    <OverviewTab 
                        pending={data.pending}
                        printing={data.printing}
                        lowSpools={data.lowSpools}
                    />
                </TabsContent>

                <TabsContent value="inventory" className="flex-1 overflow-auto mt-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <Button asChild variant="outline" className="border-slate-200 bg-white hover:bg-slate-50">
                            <Link to="/create-spool">Create Spool</Link>
                        </Button>
                        <Input
                            className="w-full sm:max-w-xs"
                            placeholder="Search inventory..."
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                        />
                    </div>
                    <CardTotalSpoolCost spools={data.allSpools} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredSpools.map(s => (
                            <SpoolItem key={s.id} spool={s} onEdit={setEditingSpool} />
                        ))}
                    </div>
                </TabsContent>

                {/* <TabsContent value="stats" className="flex-1 mt-4 outline-none overflow-auto">
                    <div className="border rounded-xl p-6 bg-slate-50 min-h-[500px] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Print Statistics</h2>

                        <div className="flex flex-row gap-4 min-h-0">
                        <div className="flex-[3] min-w-0 flex flex-col gap-4">
                            <div className="w-full">
                            <ChartSpoolMaterialLeft spools={data.allSpools} />
                            </div>
                            <div className="w-full">
                            <PrintsChart />
                            </div>
                        </div>

                        <div className="bg-blue-500 flex-[1] min-w-[220px] rounded-xl" />
                        </div>
                    </div>
                </TabsContent> */}

                <TabsContent value="stats" className="flex-1 mt-4 outline-none overflow-auto">
                    <div className="border rounded-xl p-6 bg-slate-50 min-h-[500px] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Print Statistics</h2>

                        <div className="flex-row flex gap-4">
                            
                            {/* Show Stats */}
                            <div className="flex-[3]"> 
                                <PrintsChart />
                            </div>

                            {/* PieCharts */}
                            <div className="flex-[1]">
                                <ChartSpoolMaterialLeft spools={data.allSpools} />
                                <div className="mt-4" /> {/* Ugly solution for spacing */}
                                <ChartPrintOutcome prints={data.allCompletedPrints} />
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="test" className="flex-1 mt-4 outline-none">
                    <div className="border rounded-xl p-6 bg-slate-50 min-h-[500px] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Print Statistics</h2>

                        <div className="flex-row flex">
                            
                            {/* Show Stats */}
                            <div className="flex-[3]"> 
                                <CompletedPrintsChart
                                    prints={data.allCompletedPrints}
                                ></CompletedPrintsChart>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
            {editingSpool && (
                <EditSpoolForm 
                    spool={editingSpool} 
                    onCancel={() => setEditingSpool(null)} 
                    onSubmit={handleUpdateSpool}
                />
            )}
        </div>
    );
}
