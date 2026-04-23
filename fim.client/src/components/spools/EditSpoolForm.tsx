import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useEffect} from "react";
import type { components } from "../../types/schema";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { ColorCheckBox } from "../ColorPickerComponent";
import { Checkbox } from "../ui/checkbox";
import { ExistingSpoolContext } from "../context/AddSpoolContextType";


type Spool = components["schemas"]["SpoolDto"];

type EditSpoolFormProps = {
    spool: Spool;
    onSubmit: (id: number | string, updated: Partial<Spool>) => Promise<void>;
    onCancel: () => void;
}

export const EditSpoolForm = ({ spool, onSubmit, onCancel }: EditSpoolFormProps) => {
    const { formData, setFormData } = useContext(ExistingSpoolContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev,
            [name]: name === "totalWeight" || name === "spoolCost" || name === "diameter" ? value ===""? null : parseFloat(value) : value }));
    }
    
    function getChangedFields<T>(original: T, updated: T): Partial<T> {
        const changedFields: Partial<T> = {};
        for (const key in updated) {
            if (updated[key] !== original[key]) {
                changedFields[key] = updated[key];
            }
        }
        return changedFields;
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const changed: Partial<Spool> = getChangedFields(spool, formData);
        await onSubmit(spool.id!, changed);
    }

    useEffect(() => {
        setFormData(spool);
    },[setFormData, spool]);

    return (
        <Dialog open onOpenChange={(open) => {
            if (!open) {
                onCancel();
            }
        }}>
            <DialogContent className="bg-white sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Spool</DialogTitle>
                    <DialogDescription>Make changes to the spool details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* General Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">General</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="brand">Brand</Label>
                                <Input id="brand" name="brand" value={formData?.brand} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="material">Material</Label>
                                <Input id="material" name="material" value={formData?.material} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="colorName">Color Name</Label>
                                <Input id="colorName" name="colorName" value={formData?.colorName} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="finish">Finish</Label>
                                <Input id="finish" name="finish" value={formData?.finish ?? ""} onChange={handleChange} />
                            </div>
                        </div>

                        <ColorCheckBox formData={formData} setFormData={setFormData} />

                        <div>
                            <Label htmlFor="productUrl">Product URL</Label>
                            <Input id="productUrl" name="productUrl" type="url" value={formData?.productUrl ?? ""} onChange={handleChange} />
                        </div>

                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Input id="notes" name="notes" value={formData?.notes ?? ""} onChange={handleChange} />
                        </div>

                    </div>

                    {/* Physical Properties */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Physical Properties</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="diameter">Diameter (mm)</Label>
                                <Input type="number" step="0.01" id="diameter" name="diameter" value={formData?.diameter} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="totalWeight">Total Weight (g)</Label>
                                <Input type="number" id="totalWeight" name="totalWeight" value={formData?.totalWeight} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="spoolCost">Cost</Label>
                                <Input type="number" step="10" id="spoolCost" name="spoolCost" value={formData?.spoolCost} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Print Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Print Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="extruderTemp">Extruder Temp (°C)</Label>
                                <Input type="number" id="extruderTemp" name="extruderTemp" value={formData?.extruderTemp ?? ""} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="bedTemp">Bed Temp (°C)</Label>
                                <Input type="number" id="bedTemp" name="bedTemp" value={formData?.bedTemp ?? ""} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Properties</h3>

                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="glow" className="bg-gray-200" checked={!!formData?.glow}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, glow: !!checked }))}
                                />
                                <Label htmlFor="glow">Glow</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="translucent" className="bg-gray-200" checked={!!formData?.translucent}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, translucent: !!checked }))}
                                />
                                <Label htmlFor="translucent">Translucent</Label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <DialogFooter className="pt-4">
                        <Button className="bg-blue-500 text-white" type="submit">Edit Spool</Button>
                        <Button className="bg-red-500 text-white" type="button" onClick={onCancel}>
                        Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}