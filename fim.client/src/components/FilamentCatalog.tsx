import { useState, useEffect } from "react"
import type { components } from "@/types/schema"
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
import { StarIcon } from "@/components/icons/mynaui-star"
import { StarSolidIcon } from "@/components/icons/mynaui-star-solid"
import { ConfirmDialog } from "@/components/popUp/ConfirmPopup"
import { SetSpoolPrice } from "@/components/popUp/SpoolPricePopup"



type SpoolCatalog = components["schemas"]["FilamentRecordDto"];
type Spool = components["schemas"]["SpoolDto"];
type PagedFilamentResult = {
    items: SpoolCatalog[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

const SortOrder = {
    Name: "name",
    Brand: "brand",
    Material: "material",
    Color: "color",
    Diameter: "diameter"
} as const;

type SortOrder = typeof SortOrder[keyof typeof SortOrder];

export function CatalogList() {
    const [result, setResult] = useState<PagedFilamentResult | null>(null);
    const [page, setPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: SortOrder, direction: 'asc' | 'desc' }>({
        key: SortOrder.Name,
        direction: 'asc'
    });

    const handleSort = (key: SortOrder) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        setPage(1);
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const pageSize = 10;
    const [mySpools, setMySpools] = useState<Spool[]>([]);

    const totalCount = result?.totalCount ?? 0;
    const startEntry = (page - 1) * pageSize + 1;
    const endEntry = Math.min(page * pageSize, totalCount);

    const spoolExists = (catalogItem: SpoolCatalog) => {
        return mySpools.some(s => s.identifier === catalogItem.identifier)
    }

    useEffect(() => {
        const loadMySpools = async () => {
            try {
                const data: Spool[] = await authFetch("https://localhost:7035/Spool");
                setMySpools(data);
            }
            catch (error) {
                console.log("Failed to fetch Spool: " + error);
            }
        };
        loadMySpools();
    }, [])

    useEffect(() => {
        const loadCatalog = async () => {
            setIsLoading(true);
            try {
                const url = `https://localhost:7035/PublicFilamentCatalog?pageNumber=${page}&pageSize=${pageSize}&sortOrder=${sortConfig.key}&isDescending=${sortConfig.direction === 'desc'}&searchTerm=${encodeURIComponent(searchTerm)}`;
                const data: PagedFilamentResult = await authFetch(url);
                setResult(data);
            }
            catch (error) {
                console.log("Failed to fetch SpoolCatalog: " + error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => loadCatalog(), 300);
        return () => clearTimeout(timeoutId);
    }, [page, sortConfig, searchTerm]);

    const setFavorite = async (id: string) => {

        setResult(prev =>
            prev ? {
                ...prev,
                items: prev.items.map(s =>
                    s.identifier === id ?
                        { ...s, isFavorite: true }
                        : s
                )
            } : null
        );
       
            try {
                await authFetch(`https://localhost:7035/UserFavoriteFilament/SetFavorite/${id}`, {
                    method: "POST"
                });
                
            }
            catch (error) {
                console.log("Failed to post to UserFavoriteFilament " + error)
            }
    }

    const deleteFavorite = async (id: string) => { 

        setResult(prev =>
            prev ? {
                ...prev,
                items: prev.items.map(s =>
                    s.identifier === id ?
                        { ...s, isFavorite: false }
                        : s
                )
            } : null
        );

        try {
            await authFetch(`https://localhost:7035/UserFavoriteFilament/DeleteFavorite/${id}`, {
                method: "POST"
            })
        }
        catch (error) {
            console.log("Failed to post to UserFavoriteFilament " + error);
        }
    }

    const favoriteToSpools = 
        async (filament: SpoolCatalog, price: number) => {
            try {
                const replacePrice = Number(price.toString().replace(",", "."));
                const response: Spool = await authFetch(`https://localhost:7035/Spool/FavoriteToSpool`, {
                    method: "POST",
                    body: JSON.stringify({
                        filamentDto: filament,
                        price: replacePrice
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                
                setMySpools(prev => [...prev, response]);
            }
            catch (error) {
                console.log("Failed to fetch" + error);
            }
        }
        
    const SortableHeader = ({
        label,
        value,
        currentConfig,
        onSort
    }: {
        label : string,
        value: SortOrder,
        currentConfig: { key: SortOrder, direction: 'asc' | 'desc' },
        onSort: (val: SortOrder) => void
     }) => {
        const isActive = currentConfig.key === value;

        return (
            <TableHead className="cursor-pointer" onClick={() => onSort(value)}>
                <div className="flex items-center gap-2">
                    {label}
                    <span className={`text-xs ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {isActive ? (currentConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                </div>
            </TableHead>
        );
    };

        
    return (

        <div>
            <div className="flex justify-end mb-4">
                <input type="text" 
                id="searchInput"
                placeholder="Search name, brand, material..." 
                className="border rounded px-4 py-2 w-full md:w-64 bg-transparent"
                value={searchTerm}
                onChange={(e) => { 
                    setSearchTerm(e.target.value); 
                    setPage(1); 
                }}/>

            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableHeader label="Name" value={SortOrder.Name} currentConfig={sortConfig} onSort={handleSort} />
                        <SortableHeader label="Spool-Brand" value={SortOrder.Brand} currentConfig={sortConfig} onSort={handleSort} />
                        <SortableHeader label="Diameter" value={SortOrder.Diameter} currentConfig={sortConfig} onSort={handleSort} />
                        <SortableHeader label="Material" value={SortOrder.Material} currentConfig={sortConfig} onSort={handleSort} />
                        <SortableHeader label="Color" value={SortOrder.Color} currentConfig={sortConfig} onSort={handleSort} />
                        <TableHead>Weight</TableHead>
                        <TableHead>Finish</TableHead>
                        <TableHead>Translucent</TableHead>
                        <TableHead>Glow</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow><TableCell colSpan={10} className="text-center">Loading...</TableCell></TableRow>
                    ) :  result?.items.length === 0 ? (
                        <TableRow><TableCell colSpan={10} className="text-center">No results found.</TableCell></TableRow>
                    ) : result?.items.map(s => (
                        <TableRow key={s.identifier}>
                            <TableCell>{s.name}</TableCell>
                            <TableCell>{s.brand}</TableCell>
                            <TableCell>{s.diameter}mm</TableCell>
                            <TableCell>{s.material}</TableCell>
                            <TableCell>
                                {s.colorHexes != null ? (
                                    s.colorHexes.slice(0, 6).map((hex, i) => (
                                        <div key={i}
                                            title={`#${hex}`}
                                            style={{
                                            backgroundColor: `#${hex}`,
                                            height: "16px",
                                            width: "32px",
                                            border: "1px solid black",
                                            borderRadius: "3px"
                                            }}
                                        />
                                    )) 
                                ) : (
                                    s.colorHex && (
                                        <div title={`#${s.colorHex}`}
                                            style={{
                                            width: "32px",
                                            height: "16px",
                                            backgroundColor: `#${s.colorHex}`,
                                            border: "1px solid black",
                                            borderRadius: "3px"
                                        }}></div>
                                    )     
                                )
                                
                                    
                                }

                            </TableCell>
                            <TableCell>{s.weight}gr</TableCell>
                            <TableCell>{s.finish ? s.finish : "N/A" }</TableCell>
                            <TableCell>{s.translucent ? "Yes" : "No"}</TableCell>
                            <TableCell>{s.glow ? "Yes" : "No"}</TableCell>
                            <TableCell>
                                {s.isFavorite == false ? (
                                    <div>
                                        <Button className="bg-transparent"
                                            size="icon"
                                            onClick={() => setFavorite(s.identifier)}>
                                            <StarIcon></StarIcon>
                                        </Button>
                                        
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        <ConfirmDialog title="Remove favorite"
                                            description={`Are you sure you want to remove ${s.identifier}`}
                                            confirmText="Delete"
                                            confirmButtonClassName="bg-red-500 text-white"
                                            cancelButtonClassName="bg-blue-500 text-black"
                                            onConfirm={() => deleteFavorite(s.identifier)}
                                        ><Button className="bg-transparent" size="icon" ><StarSolidIcon className="text-yellow-500"></StarSolidIcon></Button></ConfirmDialog>
                                    </div>
                                    )}
                                    <div>
                                        {spoolExists(s) ? (
                                            <SetSpoolPrice warningtext="This spool already exists in your inventory" onConfirm={(price: number) => favoriteToSpools(s, price)}></SetSpoolPrice>
                                        ) : (
                                            <SetSpoolPrice onConfirm={(price: number) => favoriteToSpools(s, price)}></SetSpoolPrice>
                                        )}
                                    </div>
                            </TableCell>
                        </TableRow>
                    ))}
                
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                    Showing <strong>{startEntry}</strong> to <strong>{endEntry}</strong> of <strong>{totalCount}</strong> entries
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        className="bg-transparent"
                        variant="outline"
                        disabled={page === 1 || isLoading}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}>
                            Previous
                    </Button>

                    <div className="text-sm">
                        Page {page} of {Math.ceil(totalCount / pageSize) || 1}
                    </div>

                    <Button
                        className="bg-transparent"
                        variant="outline"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={endEntry >= totalCount || isLoading}>
                            Next
                    </Button>
                </div>
            </div>
        </div>
    )
}