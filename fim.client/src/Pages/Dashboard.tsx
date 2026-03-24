import type { components } from "../types/schema" 
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { authFetch } from "../auth/authFetch"
import DashCard from "@/components/DashboardCard"
import PrintsChart from "@/components/BarChart"
import { EditSpoolForm } from "@/components/spools/EditSpoolForm"

type PrintDto = components["schemas"]["PrintDto"];
type SpoolDto = components["schemas"]["SpoolDto"];

export default function DashboardHome() {
    const [pendingPrints, setPendingPrints] = useState<PrintDto[]>([]);
    const [allLowSpools, setAllLowSpools] = useState<SpoolDto[]>([]);
    const [printingPrints, setPrintingPrints] = useState<PrintDto[]>([]);
    const [allSpools, setAllSpools] = useState<SpoolDto[]>([]);
    const [searchSpools, setSearchSpools] = useState<SpoolDto[]>([]);
    const [editingSpool, setEditingSpool] = useState<SpoolDto | null>(null);

    const [searchData, setSearchData] = useState({
        searchString: ""
    });

    useEffect(() => {
        const loadPendingPrints = async () => {
            try {
                const data: PrintDto[] = await authFetch(`https://localhost:7035/Print/pending`);
                setPendingPrints(data);
            } catch (error) {
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
            } catch (error) {
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
            } catch (error) {
                console.log("Failed to fetch: " + error);
            }
        };
        loadPrintingPrints();
    }, []);

    useEffect(() => {
        const loadAllSpools = async () => {
            try {
                const data: SpoolDto[] = await authFetch(`https://localhost:7035/spool`);
                setAllSpools(data);
            }
            catch (error) {
                console.log("Failed to fetch spools: " + error)
            }

        };
        loadAllSpools();
    }, []);

    useEffect(() => {
        setSearchSpools(allSpools)
    }, [allSpools])

    const handleUpdateSpool = async (id: number | string, updated: Partial<SpoolDto>) => {
        try {
            const updateSpool: SpoolDto = await authFetch(`https://localhost:7035/spool/${id}`, {
                method: "PATCH",
                body: JSON.stringify(updated)
            });
            setAllSpools(prev => prev.map(s => s.id === id ? updateSpool : s));
            setEditingSpool(null);
        } catch (error) {
            console.error("Error updating spool", error);
        }
    }
    const handleSetEdit = (s:SpoolDto) => {
        setEditingSpool(null);
        setEditingSpool(s);
    }

    const getRemainingWeightValue = (spool: SpoolDto) => Number(spool.remainingWeight);

    
    
    return (
        <div className="flex flex-col h-screen p-4 gap-4 overflow-scroll">
            {/* Övre sektion med max 50% höjd */}
            <div className="max-w-full max-h-[50%] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <Input placeholder="Search spools"
                        type="search" id="input-field-search"
                        value={searchData.searchString}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchData({ searchString: value });

                            const filtered = (searchData.searchString == null || searchData.searchString == "") ? allSpools : allSpools.filter(spool =>
                                spool.color.toLowerCase().includes(value.toLowerCase()) ||
                                spool.brand.toLowerCase().includes(value.toLowerCase()) ||
                                spool.material.toLowerCase().includes(value.toLowerCase())
                                
                            );
                            setSearchSpools(filtered);

                        }} />
                </div>

                <div className="flex gap-4">
                    <div className="w-1/2 border p-4 overflow-y-auto max-h-[40vh]">
                        <div className="grid grid-cols-3 gap-4">
                            <DashCard<PrintDto>
                                title="Pending prints"
                                items={pendingPrints}
                                typeName="prints"
                                renderItem={(p) => (
                                    <span className="text-xl">
                                        {p.name}, {new Date(p.createdAt).toLocaleString("sv-SE", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                )}
                            />
                            <DashCard<SpoolDto>
                                title="Low spools"
                                items={allLowSpools}
                                typeName="spools"
                                renderItem={(s) => <span className="text-xl">{s.brand} {s.material} {s.color}</span>}
                            />
                            <DashCard
                                title="Live prints"
                                items={printingPrints}
                                typeName="prints"
                                renderItem={(p) => <span className="text-xl">{p.name}</span>}
                            />
                        </div>
                    </div>

                    <div className="bg-blue-200 w-1/2 p-4 overflow-y-auto max-h-[40vh]">
                        {searchSpools.map(s => (
                            <button key={s.id} onClick={() => handleSetEdit(s)} className="block bg-blue-300 text-left w-full hover:bg-orange-300 p-1">
                                {s.brand}, {s.material}, {s.color} | - {s.remainingWeight} grams left
                                {getRemainingWeightValue(s) < 0 ? (
                                    <span className="ml-2 font-semibold text-red-600">(Warning: Negative)</span>
                                ) : null}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nedre sektion för diagram */}
            <div className="flex-1 overflow-y-auto">
                <PrintsChart />
            </div>
            {/*{editingSpool ?  }*/}
            {editingSpool ? (
                <EditSpoolForm
                    key={editingSpool.id}
                    spool={editingSpool}
                    onCancel={() => setEditingSpool(null)}
                    onSubmit={handleUpdateSpool}></EditSpoolForm>
            ) : (null) }
        </div>
    )
}
