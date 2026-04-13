import { createContext } from 'react'
import type { components } from "@/types/schema";

type SpoolDto = components["schemas"]["CreateSpoolDto"];

type ExistingSpoolContextType = {
    formData: SpoolDto;
    setFormData: React.Dispatch<React.SetStateAction<SpoolDto>>;
}

export const defaultSpool: SpoolDto = {
    brand: "",
    material: "",
    colorName: "",
    diameter: 1.75,
    totalWeight: 0,
    spoolCost: 0,
    bedTemp: 0,
    colorHex: "",
    colorHexes: [],
    extruderTemp: 0,
    finish: "",
    glow: false,
    translucent: false
}

export const ExistingSpoolContext = createContext<ExistingSpoolContextType>({
    formData: defaultSpool,
    setFormData: () => { }
});