import {
    TableCell,
    TableRow
} from "@/components/ui/table";
import { CancelPrint } from "@/components/popUp/CancelPrintPopup"
import type { components } from "src/types/schema"

type Print = components["schemas"]["PrintDto"];

type PrintTableRowProps = {
    print: Print;
    shortDate: (date: Date) => string;
    parseDate: (dateStr: string) => Date;
    UpdateGramsUsed: (print: Print, grams: number) => void;
    progressBarWidth: (print: Print) => number | undefined;
}


export const UpdatePercentageBar = ({
    print,
    shortDate,
    parseDate,
    UpdateGramsUsed,
    progressBarWidth
}: PrintTableRowProps) => {

    const percentage = progressBarWidth(print);

    const statusMap: Record<number, string> = {
        0: "Pending",
        1: "Printing",
        2: "Done",
        3: "Failed",
        4: "Cancelled"
    }

    return (
        <TableRow>
            <TableCell>{print.name}</TableCell>
            <TableCell>{statusMap[print.status]}</TableCell>
            <TableCell >{percentage}% {shortDate(parseDate(print.startedAt !== null ? print.startedAt : ""))}
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/70" style={{ border: "1px solid black" }}>
                    <div className={`h-full rounded-full transition-all bg-green-400`}
                        style={{ width: `${percentage}%` }}>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <CancelPrint onConfirm={(grams: number) => UpdateGramsUsed(print, grams)}></CancelPrint>
            </TableCell>
        </TableRow>
    )
}
