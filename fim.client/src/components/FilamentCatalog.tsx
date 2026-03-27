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

type SpoolCatalog = components["schemas"]["FilamentRecord"];

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
       
            try {
                await authFetch(`https://localhost:7035/UserFavoriteFilament/SetFavorite/${id}`, {
                    method: "POST"
                });
                
            }
            catch (error) {
                console.log("Failed to post to UserFavoriteFilament " + error)
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
                        <TableCell>
                            <Button className="bg-transparent" size="icon" onClick={() => setFavorite(s.identifier) }>
                                <StarIcon></StarIcon>
                            </Button>
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