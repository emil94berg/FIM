import type { components } from "../../types/schema"
import { useState, useEffect, use } from "react";


type Print = components["schemas"]["Print"];

type EditPrintFormProps = {
    print: Print;
    onSubmit: (print: Print) => Promise<void>;
    onCancel: () => void;
}

export const EditPrintForm = ({ print, onSubmit, onCancel }: EditPrintFormProps) => {
    const [formData, setFormData] = useState(print);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    }


    return (
        <form onSubmit={handleSubmit}>
            <input
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value })) }
            ></input>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel} >Cancel</button>
        </form>
    
    
    )

}