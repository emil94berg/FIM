import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { components } from "../types/schema";

type CreateSpoolDto = components["schemas"]["CreateSpoolDto"];

type Props = {
    formData: CreateSpoolDto;
    setFormData: React.Dispatch<React.SetStateAction<CreateSpoolDto>>
}

export const ColorCheckBox = ({formData, setFormData }: Props) => {
    const [checked, setChecked] = useState(false)
    const [numberOfColors, setNumbersOfColors] = useState(0)
    const [colors, setColors] = useState<string[]>([]);

    const updateFormHexColors = (colors: string[]) => {
        setFormData(prev => ({
            ...prev,
            colorHexes: colors.map(c => c.replace("#", "")),
            colorHex: ""
        }))
    }

    const handleColorsChanged = (index: number, value: string) => {
        const newColors = [...colors];
        newColors[index] = value;
        setColors(newColors);

        updateFormHexColors(newColors);
    }

    const handleColorChanged = (value: string) => {
        setFormData(prev => ({
            ...prev,
            colorHex: value.replace("#", ""),
            colorHexes: []
        }));
    };


    return (
        <div>
            <div style={{ display: "flex", flex: "row", gap: "6px", margin: "6px 0" }}>
                <Label>Multiple colors?</Label>
                <Checkbox className="bg-transparent"
                    style={{ border: "solid 1px black" }}

                    checked={checked}
                    onCheckedChange={(value) => {
                        const isChecked = !!value
                        setChecked(isChecked);

                        if (isChecked) {
                            setColors([]);
                            setNumbersOfColors(0);
                            setFormData(prev => ({
                                ...prev,
                                colorHex: ""
                            }))
                        }
                        else {
                            setFormData(prev => ({
                                ...prev,
                                colorHexes: []
                            }))
                        }
                    }}>
                </Checkbox>
            </div>
            {
                checked == false ? (
                    <Label>
                        Pick a color
                        <Input
                            type="color"
                            value={formData.colorHex ?
                                `#${formData.colorHex}`
                                : "#000000"}
                            onChange={(e) =>
                                handleColorChanged(e.target.value)}></Input>
                    </Label>
                ) : (
                    <Label>Number of colors:
                        <Input type="number"
                            max="10"
                            value={numberOfColors}
                            onChange={(e) => {
                                const val = Number(e.target.value)
                                setNumbersOfColors(val);

                                const newColors = Array(val).fill("#000000");
                                setColors(newColors);
                                updateFormHexColors(newColors);
                            }}
                        ></Input>
                        <div style={{ display: "flex", gap: "6px" }}>
                            {Array.from({ length: numberOfColors }).map((_, i) => (
                                <Input
                                    style={{ height: "40px", width: "40px" }}
                                    key={i}
                                    type="color"
                                    value={colors[i] || "#000000"}
                                    onChange={(e) => {
                                        handleColorsChanged(i, e.target.value)
                                    }}
                                ></Input>

                            ))}
                        </div>
                    </Label>


                )}

        </div>
    )
}