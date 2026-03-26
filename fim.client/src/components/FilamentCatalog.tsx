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

    
 



    return (

        <Table border={1}>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Spool-Brand</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Color</TableHead>
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
                        <TableCell>
                            {s.isFavorite == false ? (
                                <Button className="bg-transparent"
                                    size="icon"
                                    onClick={() => setFavorite(s.identifier)}>
                                    <StarIcon></StarIcon>
                                </Button>
                            ) : (
                                
                                    <Button className="bg-transparent"
                                        size="icon"
                                        onClick={() => deleteFavorite(s.identifier)}>
                                        <StarSolidIcon className="text-yellow-500"></StarSolidIcon>
                                    </Button>
                                )}
                            
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>


    )
}