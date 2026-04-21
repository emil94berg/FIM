import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import type { components } from "../../types/schema";
import { ColorCheckBox } from "@/components/ColorPickerComponent"
import { ExistingSpoolContext, defaultSpool } from "@/components/context/AddSpoolContextType"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "../ui/checkbox";


type CreateSpoolDto = components["schemas"]["CreateSpoolDto"];

type AddSpoolFormProps = {
    onSubmit: (spool: CreateSpoolDto) => Promise<void>;
    onCancel: () => void;
}

export const AddSpoolForm = ({ onSubmit, onCancel }: AddSpoolFormProps) => {
    const { formData, setFormData } = useContext(ExistingSpoolContext)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => {
            return {
                ...prev,
            [name]:
                type === "checkbox" ?
                    checked :
                name === "totalWeight" ||
                name === "spoolCost" ||
                name === "diameter" || 
                name === "extruderTemp" ||
                name === "bedTemp"
                ? value === "" ? null : parseFloat(value) : value 
        }});
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(formData);
        setFormData(defaultSpool);
        onCancel();
    }

    return (
        <Dialog open onOpenChange={(open) => {
            if (!open) {
                setFormData(defaultSpool);
                onCancel();
            }
        }}>
            <DialogContent className="bg-white sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add a New Spool</DialogTitle>
                    <DialogDescription>Fill out the details of the spool below.</DialogDescription>
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
                        <Button className="bg-blue-500 text-white" type="submit">Create Spool</Button>
                        <Button className="bg-red-500 text-white" type="button" onClick={() => { setFormData(defaultSpool); onCancel(); }}>
                        Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
