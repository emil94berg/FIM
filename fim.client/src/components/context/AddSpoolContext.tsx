import { ExistingSpoolContext, defaultSpool } from "@/components/Context/AddSpoolContextType"
import { useState } from 'react'
import type { components } from "@/types/schema"

type SpoolDto = components["schemas"]["CreateSpoolDto"];



export default function SpoolProvider({ children }: {children: React.ReactNode}) {
    const [formData, setFormData] = useState<SpoolDto>(defaultSpool);
    return (
        <ExistingSpoolContext.Provider value={{
            formData: formData,
            setFormData: setFormData
        }}>
            {children}
        </ExistingSpoolContext.Provider>
    )
}