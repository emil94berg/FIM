import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"




type DashboardCardProps<T> = {
    title: string
    items: T[];
    typeName: string
    renderItem: (item: T) => React.ReactNode;
}

export default function DashCard<T>({title, typeName, items, renderItem }: DashboardCardProps<T>) {
    return (
        <Card className="bg-gray-200 max-h-min w-fit">
                <CardHeader className="text-center bg-gray-100">{title}</CardHeader>
            <CardContent className="flex gap-4 flex-wrap">
                {items.map((item, index) => (
                    <div key={index}>{renderItem(item)}</div>
                ))}
            </CardContent>
            <CardFooter className="bg-gray-100">
                {`Number of ${typeName}`}{": "}{items.length}
            </CardFooter>
        </Card>
    )
}