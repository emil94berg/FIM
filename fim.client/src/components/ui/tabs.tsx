import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Tabs({
    className,
    orientation = "horizontal",
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            className={cn(
                "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
                className
            )}
            {...props}
        />
    )
}

const tabsListVariants = cva(
    "group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground",
    {
        variants: {
            variant: {
                default: "rounded-lg bg-muted p-[3px]",
                line: "gap-6 bg-transparent border-b w-full justify-start rounded-none px-0",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function TabsList({
    className,
    variant = "default",
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
        />
    )
}

function TabsTrigger({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                // Bas-styling (ta bort knappar/bubblor-utseende)
                "bg-transparent relative inline-flex items-center justify-center gap-1.5 pb-3 pt-2 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                "text-muted-foreground hover:text-foreground",

                // Ta bort bakgrund och skugga som fanns i din förra version
                "data-[state=active]:bg-transparent data-[state=active]:text-foreground shadow-none",

                // Underline-logiken (after-elementet)
                "after:absolute after:bg-blue-600 after:opacity-0 after:transition-opacity",

                // Visa linjen endast när varianten är 'line' och statet är 'active'
                "group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",

                // Positionering av linjen i botten
                "after:inset-x-0 after:bottom-0 after:h-[2px]",

                className
            )}
            {...props}
        />
    )
}

function TabsContent({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn("flex-1 text-sm outline-none pt-4", className)}
            {...props}
        />
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }