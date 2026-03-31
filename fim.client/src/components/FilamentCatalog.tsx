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

const SortOrder = {
    Name: "name",
    Brand: "brand",
    Material: "material",
    Color: "color",
    Diameter: "diameter"
} as const;

type SortOrder = typeof SortOrder[keyof typeof SortOrder];

export function CatalogList() {
    const [spoolCatalog, setSpoolCatalog] = useState<SpoolCatalog[]>([]);
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Name);
    const [isLoading, setIsLoading] = useState(false);
    const pageSize = 10;
    const [mySpools, setMySpools] = useState<Spool[]>([]);

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
                const url = `https://localhost:7035/PublicFilamentCatalog?pageNumber=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
                const data: SpoolCatalog[] = await authFetch(url);
                setSpoolCatalog(data);
            }
            catch (error) {
                console.log("Failed to fetch SpoolCatalog: " + error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCatalog();
    }, [page, sortOrder]);

    useEffect(() => {
        setPage(1);
    }, [sortOrder]);

    const setFavorite = async (id: string) => {

        setSpoolCatalog(prev =>
            prev.map(s =>
                s.identifier === id ?
                    { ...s, isFavorite: true }
                    : s
            )
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

        setSpoolCatalog(prev =>
            prev.map(s =>
                s.identifier === id ?
                    { ...s, isFavorite: false }
                    : s
            )
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
        
    return (

        <div>
        <div className="flex gap-2 mb-4">
            {Object.entries(SortOrder).map(([key, value]) => (
                <Button
                    key={value}
                    className="bg-transparent"
                    onClick={() => setSortOrder(value)}>
                    {key}
                </Button>
            ))}
        </div>
        <Table border={1}>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Spool-Brand</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Finish</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>
                ) :  spoolCatalog.map(s => (
                    <TableRow key={s.identifier}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.brand}</TableCell>
                        <TableCell>{s.material}</TableCell>
                        <TableCell>{s.weight}gr</TableCell>
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
                        <TableCell>{ s.finish }</TableCell>
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
                                <div>
                                        <ConfirmDialog title="Remove favorite"
                                            description={`Are you sure you want to remove ${s.identifier}`}
                                            confirmText="Delete"
                                            confirmButtonClassName="bg-red-500 text-white"
                                            cancelButtonClassName="bg-blue-500 text-black"
                                            onConfirm={() => deleteFavorite(s.identifier)}
                                        ><Button className="bg-transparent" size="icon" ><StarSolidIcon className="text-yellow-500"></StarSolidIcon></Button></ConfirmDialog>
                                        {spoolExists(s) ? (
                                            <SetSpoolPrice warningtext="This spool already exists in your inventory"
                                                onConfirm={(price: number) => favoriteToSpools(s, price)}
                                            ></SetSpoolPrice>
                                            ) : (
                                            <SetSpoolPrice
                                                onConfirm={(price: number) => favoriteToSpools(s, price)}
                                            ></SetSpoolPrice>
                                        )}
                                        
                                </div>
                                    
                                    
                                )}
                            
                        </TableCell>
                    </TableRow>
                ))}
               
            </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    className="bg-transparent"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                >
                    Previous
                </Button>
                <div className="text-sm font-medium">
                    Page {page}
                </div>
                <Button
                    className="bg-transparent"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={spoolCatalog.length < pageSize || isLoading}>
                    Next
                </Button>
            </div>
            </div>
    )
}