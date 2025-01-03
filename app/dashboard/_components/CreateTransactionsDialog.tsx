import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
    trigger: ReactNode;
    type: TransactionType
}

export default function CreateTransactionsDialog({trigger, type}: Props) {
  return (
    <Dialog>
        <DialogTrigger asChild>
            {trigger}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Create a new
                    <span className={cn(
                        "m-1",
                        type === 'income' ? 'text-emerald-500' : 'text-red-500')}>
                            {type}
                    </span>
                    transaction
                </DialogTitle>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}
