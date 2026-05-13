import type { components } from "@/types/schema";

type SpoolDto = components["schemas"]["SpoolDto"];

interface Props {
    spool: SpoolDto;
    onEdit: (s: SpoolDto) => void;
}

export function SpoolItem ({ spool, onEdit }: Props) {
    const remainingWeight = Number(spool.remainingWeight);
    const totalWeight = Number(spool.totalWeight);

    const getRemainingPercentage = () => {
        if (!Number.isFinite(remainingWeight) || totalWeight <= 0 || !Number.isFinite(totalWeight)) {
            return 0;
        }
        return Math.max(0, Math.min(100, (remainingWeight / totalWeight) * 100));
    };

    const getBarColorClass = () => {
        const percentage = getRemainingPercentage();
        if (remainingWeight <= 0) return "bg-red-500";
        if (percentage <= 25) return "bg-yellow-500";
        return "bg-green-500";
    }

    const percentage = getRemainingPercentage();

    return (
        <button
            onClick={() => onEdit(spool)}
            className="block w-full space-y-2 rounded-md border border-slate-300 bg-white p-3 text-left transition-colors hover:bg-slate-100"
        >
            <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-slate-900">
                    {spool.identifier}, {spool.material}, {spool.diameter}mm, {spool.colorName}
                </span>
                <span className={remainingWeight <= 0 ? "font-semibold text-red-600" : "text-slate-800"}>
                    {spool.remainingWeight}gr / {spool.totalWeight}gr
                </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full rounded-full transition-all ${getBarColorClass()}`} style={{ width: `${percentage}%` }}/>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-700">
                <span>{Math.round(percentage)}% remaining</span>
                {remainingWeight < 0 && (
                    <span className="font-semibold text-red-600 animate-pulse">
                        Warning: Overused by {Math.abs(remainingWeight)}gr
                    </span>
                )}
            </div>
        </button>
    )
}