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


export function CatalogList(){
    const [spoolCatalog, setSpoolCatalog] = useState<SpoolCatalog[]>([]);

    useEffect(() => {
        const loadCatalog = async () => {
            try {
                const data: SpoolCatalog[] = await authFetch("https://localhost:7035/PublicFilamentCatalog");
                setSpoolCatalog(data);
            }
            catch (error) {
                console.log("Failed to fetch SpoolCatalog: " + error);
            }
        };
        loadCatalog();

    }, []);

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
                await authFetch(`https://localhost:7035/Spool/FavoriteToSpool`, {
                    method: "POST",
                    body: JSON.stringify({
                        filamentDto: filament,
                        price: price
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            catch (error) {
                console.log("Failed to fetch" + error);
            }
        }
        
  



    return (

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
                {spoolCatalog.map(s => (
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

                                        <SetSpoolPrice
                                            onConfirm={(price: number) => favoriteToSpools(s, price)}></SetSpoolPrice>
                                </div>
                                    
                                    
                                )}
                            
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>


    )
}