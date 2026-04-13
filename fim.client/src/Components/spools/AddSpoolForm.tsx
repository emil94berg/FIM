import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import type { components } from "../../types/schema";
import { ColorCheckBox } from "@/components/ColorPickerComponent"
import { ExistingSpoolContext, defaultSpool } from "@/components/Context/AddSpoolContextType"


type CreateSpoolDto = components["schemas"]["CreateSpoolDto"];

type AddSpoolFormProps = {
    onSubmit: (spool: CreateSpoolDto) => Promise<void>;
}

export const AddSpoolForm = ({ onSubmit }: AddSpoolFormProps) => {
    //const [formData, setFormData] = useState<CreateSpoolDto>({
    //    brand: existingSpool ? existingSpool.brand : "",
    //    material: existingSpool ? existingSpool.material : "",
    //    colorName: existingSpool ? existingSpool.colorName : "",
    //    diameter: existingSpool ? existingSpool.diameter : 1.75,
    //    totalWeight: existingSpool ? existingSpool.totalWeight : 0,
    //    spoolCost: existingSpool ? existingSpool.spoolCost : 0,
    //    bedTemp: existingSpool ? existingSpool.bedTemp : 0,
    //    colorHex: existingSpool ? existingSpool.colorHex : "",
    //    colorHexes: existingSpool ? existingSpool.colorHexes : [],
    //    extruderTemp: existingSpool ? existingSpool.extruderTemp : 0,
    //    finish: existingSpool ? existingSpool.finish : "",
    //    glow: existingSpool ? existingSpool.glow : false,
    //    translucent: existingSpool ? existingSpool.translucent : false
    //})

    const { formData, setFormData } = useContext(ExistingSpoolContext)

    //const memoExisting = useMemo(() => ({
    //    brand: existingSpool ? existingSpool.brand : "",
    //    material: existingSpool ? existingSpool.material : "",
    //    colorName: existingSpool ? existingSpool.colorName : "",
    //    diameter: existingSpool ? existingSpool.diameter : 1.75,
    //    totalWeight: existingSpool ? existingSpool.totalWeight : 0,
    //    spoolCost: existingSpool ? existingSpool.spoolCost : 0,
    //    bedTemp: existingSpool ? existingSpool.bedTemp : 0,
    //    colorHex: existingSpool ? existingSpool.colorHex : "",
    //    colorHexes: existingSpool ? existingSpool.colorHexes : [],
    //    extruderTemp: existingSpool ? existingSpool.extruderTemp : 0,
    //    finish: existingSpool ? existingSpool.finish : "",
    //    glow: existingSpool ? existingSpool.glow : false,
    //    translucent: existingSpool ? existingSpool.translucent : false
    //}), [existingSpool])


    //useEffect(() => {
    //    setFormData({
    //        brand: existingSpool ? existingSpool.brand : "",
    //        material: existingSpool ? existingSpool.material : "",
    //        colorName: existingSpool ? existingSpool.colorName : "",
    //        diameter: existingSpool ? existingSpool.diameter : 1.75,
    //        totalWeight: existingSpool ? existingSpool.totalWeight : 0,
    //        spoolCost: existingSpool ? existingSpool.spoolCost : 0,
    //        bedTemp: existingSpool ? existingSpool.bedTemp : 0,
    //        colorHex: existingSpool ? existingSpool.colorHex : "",
    //        colorHexes: existingSpool ? existingSpool.colorHexes : [],
    //        extruderTemp: existingSpool ? existingSpool.extruderTemp : 0,
    //        finish: existingSpool ? existingSpool.finish : "",
    //        glow: existingSpool ? existingSpool.glow : false,
    //        translucent: existingSpool ? existingSpool.translucent : false
    //    })
    //}, [existingSpool])

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
    }

   
            
    

    return (
        <div>
            <h1>Add a New Spool</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Label>
                    Spool Brand:
                    <Input type="text" name="brand" value={formData?.brand} onChange={handleChange} />
                </Label>
                <Label>
                    Material: 
                    <Input type="text" name="material" value={formData?.material} onChange={handleChange} />
                </Label>
                <Label>
                    Color name:
                    <Input type="text" name="colorName" value={formData?.colorName} onChange={handleChange} />
                </Label>
                <ColorCheckBox formData={formData} setFormData={setFormData}></ColorCheckBox>
                <Label>
                    Diameter (mm):
                    <Input type="number" name="diameter" step="0.01" value={formData?.diameter} onChange={handleChange} />
                </Label>
                <Label>
                    Total Weight:
                    <Input type="number" name="totalWeight" value={formData?.totalWeight} onChange={handleChange} />
                </Label>
                <Label>
                    Extruder temp:
                    <Input type="number" name="extruderTemp" value={formData?.extruderTemp ?? ""} onChange={handleChange} />
                </Label>
                <Label>
                    Bed temp:
                    <Input type="number" name="bedTemp" value={formData?.bedTemp ?? ""} onChange={handleChange} />
                </Label>
                <Label>
                    Glow:
                    <Input className="bg-transparent" type="checkbox" name="glow" checked={formData?.glow} onChange={handleChange} />
                </Label>
                <Label>
                    Translucent:
                    <Input className="bg-transparent" type="checkbox" name="translucent" checked={formData?.translucent} onChange={handleChange} />
                </Label>
                <Label>
                    Finish:
                    <Input type="text" name="finish" value={formData?.finish ?? ""} onChange={handleChange} />
                </Label>
                <Label>
                    Cost: 
                    <Input type="number" name="spoolCost" step="10" value={formData?.spoolCost} onChange={handleChange} />
                </Label>
                <Button className="bg-blue-500 text-black" type="submit">Create Spool</Button>
            </form>
        </div>
    )
}
