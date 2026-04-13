import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/card"




type DashboardCardProps<T> = {
    title: string
    items: T[];
    typeName: string
    renderItem: (item: T) => React.ReactNode;
    emptyMessage?: string;
}

export default function DashCard<T>({title, typeName, items, renderItem, emptyMessage }: DashboardCardProps<T>) {
    return (
        <Card className="w-full self-start overflow-hidden rounded-2xl border-slate-200/90 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold tracking-wide text-slate-800 uppercase">{title}</h3>
                    <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                        {items.length}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 px-5 py-5">
                {items.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
                        {emptyMessage ?? `No ${typeName} right now.`}
                    </p>
                ) : (
                    items.map((item, index) => (
                        <div key={index} className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3.5 transition-colors duration-200 hover:bg-white">
                            {renderItem(item)}
                        </div>
                    ))
                )}
            </CardContent>

            <CardFooter className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs font-medium text-slate-600">
                {`Number of ${typeName}`}{": "}{items.length}
            </CardFooter>
        </Card>
    )
}