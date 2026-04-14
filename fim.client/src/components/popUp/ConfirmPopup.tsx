import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


type ConfirmDialogProps = {
    children: React.ReactNode
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    confirmButtonClassName?: string
    cancelButtonClassName?: string
    onConfirm?: () => void
}

export function ConfirmDialog({
    children,
    title = "Are you sure",
    description = "This action cannot be undone",
    confirmText = "Continue",
    cancelText = "Cancel",
    confirmButtonClassName = "bg-blue-500 text-white hover:bg-destructive/90",
    cancelButtonClassName = "bg-blue-500 text-white hover:bg-destructive/90",
    onConfirm
}: ConfirmDialogProps) {
    return (
        <AlertDialog>

            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-white text black">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className={cancelButtonClassName}>{cancelText}</AlertDialogCancel>
                </AlertDialogFooter>
                <AlertDialogAction onClick={onConfirm}
                    className={confirmButtonClassName}>
                    {confirmText}
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
    )
}