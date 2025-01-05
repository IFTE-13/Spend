"use client"

import { DeleteCategory } from "@/app/(app)/dashboard/_actions/categories";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { TransactionType } from "@/lib/types";
import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react"
import { toast } from "sonner";

interface Props {
    trigger: ReactNode;
    category: Category;
}

export default function DeleteCategoryDialog({category, trigger}: Props) {
  const categoryIdentifier = `$${category.name}-${category.type}`

  const queryClient = useQueryClient()

  const deleteMutaion = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
        toast.success("Category deleted successfully", {
            id: categoryIdentifier
        })

        await queryClient.invalidateQueries({
            queryKey: ['categories']
        })
    },
    onError: () => {
        toast.error("Something went wrong", {
            id: categoryIdentifier
        })
    }
  })

  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your category
                and remove your data from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
                toast.loading("Deleting category...", {
                    id: categoryIdentifier
                    })
                    deleteMutaion.mutate({
                        name: category.name,
                        type: category.type as TransactionType
                    })
                }}>
                Continue
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}