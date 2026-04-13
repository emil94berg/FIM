import DashCard from "@/components/DashboardCard"
import type { components } from "@/types/schema";

type PrintDto = components["schemas"]["PrintDto"];
type SpoolDto = components["schemas"]["SpoolDto"];

export function OverviewTab({ pending, printing, lowSpools }: { pending: PrintDto[]; printing: PrintDto[]; lowSpools: SpoolDto[] }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 items-start">
            <DashCard
                title="Pending Queue"
                items={pending}
                typeName="prints"
                emptyMessage="No prints waiting in queue."
                renderItem={(p: PrintDto) => (
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-slate-800">{p.name}</span>
                            <span className="mt-1 inline-flex rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                                Added {new Date(p.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                    </div>
                )}>
            </DashCard>

            <DashCard
            title="Live Status"
            items={printing}
            typeName="prints"
            emptyMessage="No active print jobs."
            renderItem={(p: PrintDto) => (
                <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-semibold text-slate-800">
                        {p.name}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Printing
                    </span>
                </div>
            )}>
            </DashCard>

            <DashCard
            title="Restock Needed"
            items={lowSpools}
            typeName="spools"
            emptyMessage="All tracked spools are healthy."
            renderItem={(p: SpoolDto) => (
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-800">
                            {p.identifier} {p.brand}
                        </span>
                        <span className="text-xs text-slate-500">{p.remainingWeight} gr left</span>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        Low
                    </span>
                </div>
            )}>
            </DashCard>
        </div>
    )
}