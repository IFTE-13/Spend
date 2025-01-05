"use client"

import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteTransaction } from "../_action/deleteTransaction";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    transactionId: string
}

export default function DeleteTranactionDialog({open, setOpen, transactionId}: Props) {
  const queryClient = useQueryClient()

  const deleteMutaion = useMutation({
    mutationFn: DeleteTransaction,
    onSuccess: async () => {
        toast.success("Transaction deleted successfully", {
            id: transactionId
        })

        await queryClient.invalidateQueries({
            queryKey: ['transactions']
        })
    },
    onError: () => {
        toast.error("Something went wrong", {
            id: transactionId
        })
    }
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your transaction
                and remove your data from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
                toast.loading("Deleting transaction...", {
                    id: transactionId
                    })
                    deleteMutaion.mutate(transactionId)
                }}>
                Continue
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}
