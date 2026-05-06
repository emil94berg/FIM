import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { components } from "@/types/schema"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


type Print = components["schemas"]["PrintDto"]

type FinishedPrintsProps = {
    onCancel: () => void;
    prints: Print[];
    onRegretPrint: (print: Print) => void
}



export function FinishedPrints({ onCancel, prints, onRegretPrint }: FinishedPrintsProps) {

  return (
      <Dialog open onOpenChange={(open) => {
          if (!open) {
              onCancel()
          }
      }}>
          <DialogContent className="bg-white text-black max-w-4xl">
              <div className="flex flex-col gap-4">
                  <DialogHeader>
                      <DialogTitle>Finished Prints</DialogTitle>
                      <DialogDescription>Here you can regret your finished prints</DialogDescription>
                  </DialogHeader>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Created at</TableHead>
                              <TableHead>Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {prints.map(p => (
                              <TableRow key={p.id}>
                                  <TableCell>{p.name}</TableCell>
                                  <TableCell>{new Date(p.createdAt).toLocaleString("sv-SE", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit"
                                  })}</TableCell>
                                  <TableCell>
                                      <Button className="bg-blue-500 text-white"
                                          onClick={() => onRegretPrint(p)}
                                      >Regret</Button>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
          </DialogContent>
      </Dialog> 
  )
}
