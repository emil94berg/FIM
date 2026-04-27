import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { authFetch } from "../auth/authFetch";
import PrintsChart from "@/components/BarChart";
import { EditSpoolForm } from "@/components/spools/EditSpoolForm";
import SpoolProvider from "@/components/context/AddSpoolContext";
import { SpoolItem } from "@/components/dashboard/SpoolItem";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { Button } from "@/components/ui/button";
import type { components } from "@/types/schema";
import { Link } from "react-router-dom";
import { CompletedPrintsChart } from "@/components/dashboard/CompletedRadarChart"
import { ChartSpoolMaterialLeft } from "@/components/dashboard/ChartSpoolMaterialLeft";
import { ChartPrintOutcome } from "@/components/dashboard/ChartPrintOutcome";
import { CardTotalSpoolCost } from "@/components/dashboard/CardTotalSpoolCost";
import { CardTotalPrintCost } from "@/components/dashboard/CardTotalPrintCost";
import { ChartPrintMaterialUsed } from "@/components/dashboard/ChartPrintMaterialUsed";
import { ChartPrintGramsUsed } from "@/components/dashboard/ChartPrintGramsUsed";
import { toast } from "sonner";


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
            toast.success("Spool updated successfully");
        } catch (error) {
            console.error("Error updating spool", error);
            toast.error("Failed to update spool");
        }
    };

     const filteredSpools = data.allSpools.filter(s =>
        s.colorName.toLowerCase().includes(searchString.toLowerCase()) ||
        s.brand.toLowerCase().includes(searchString.toLowerCase()) ||
        s.material.toLowerCase().includes(searchString.toLowerCase())
    );
    return (
        <div className="flex flex-col h-screen p-4 gap-4 overflow-hidden"> 
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden w-full">
                <div className="flex items-start bg-blue-500 text-white rounded-lg px-4 py-4 flex-col">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <TabsList className="w-fit gap-4">
                        <TabsTrigger value="overview" className="bg-transparent bg-green-500">Overview</TabsTrigger>
                        <TabsTrigger value="inventory" className="bg-transparent bg-green-500">Inventory</TabsTrigger>
                        <TabsTrigger value="stats" className="bg-transparent bg-green-500">Statistics</TabsTrigger>
                        <TabsTrigger value="fun-stats" className="bg-transparent bg-green-500">Fun Stats</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="flex-1 overflow-auto mt-4">
                    <div className="mb-4 flex flex-wrap gap-2 bg-slate-100 p-4 rounded-lg">
                        <Button asChild variant="outline" className="border-slate-200 bg-white hover:bg-slate-50">
                            <Link to="/create-print">Create Print</Link>
                        </Button>
                        <Button asChild variant="outline" className="border-slate-200 bg-white hover:bg-slate-50">
                            <Link to="/activePrints">Active Prints</Link>
                        </Button>
                    </div>

                    <div className="p-4">
                        <OverviewTab 
                        pending={data.pending}
                        printing={data.printing}
                        lowSpools={data.lowSpools}
                        />
                    </div>
                   
                </TabsContent>

                <TabsContent value="inventory" className="flex-1 overflow-auto mt-4">
                    <div className="pt-4 px-4 mb-4 gap-2 bg-slate-100 p-4 rounded-lg">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <Button asChild variant="outline" className="border-slate-200 bg-white hover:bg-slate-50">
                                <Link to="/create-spool">Create Spool</Link>
                            </Button>
                            <Input
                                className="w-full sm:max-w-xs bg-white border-slate-400"
                                placeholder="Search inventory..."
                                value={searchString}
                                onChange={(e) => setSearchString(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {filteredSpools.map(s => (
                                <SpoolItem key={s.id} spool={s} onEdit={setEditingSpool} />
                            ))}
                        </div>
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

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                            <div className="xl:col-span-8 flex flex-col gap-4">
                                <PrintsChart />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ChartPrintOutcome prints={data.allCompletedPrints} />
                                    <ChartPrintGramsUsed prints={data.allCompletedPrints} />
                                </div>
                            </div>

                            <div className="xl:col-span-4 flex flex-col gap-4">
                                <ChartSpoolMaterialLeft spools={data.allSpools} />
                                <ChartPrintMaterialUsed prints={data.allCompletedPrints} />
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="fun-stats" className="flex-1 mt-4 outline-none">
                    <div className="border rounded-xl p-6 bg-slate-50 min-h-[500px] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Various Statistics</h2>

                        <div className="mb-4 pt-4 gap-4 px-4">
                            {/* Show Stats */}
                            <div className="flex-[3] mb-4"> 
                                <CompletedPrintsChart
                                    prints={data.allCompletedPrints}
                                ></CompletedPrintsChart>
                            </div>
                            <CardTotalSpoolCost spools={data.allSpools} />
                            <CardTotalPrintCost prints={data.allCompletedPrints} />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
            {editingSpool && (
                <SpoolProvider>
                    <EditSpoolForm 
                        spool={editingSpool} 
                        onCancel={() => setEditingSpool(null)} 
                        onSubmit={handleUpdateSpool}
                    />
                </SpoolProvider>
            )}
        </div>
    );
}
