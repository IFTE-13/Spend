"use client"

import { useQuery } from "@tanstack/react-query"
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from "lucide-react"
import { Category } from "@prisma/client"
import { TransactionType } from "@/lib/types"
import { cn } from "@/lib/utils"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import SkeletonWrapper from "@/components/wrapper/SkeletonWrapper"
import CreateCategoryDialog from "@/app/(app)/dashboard/_components/CreateCategoryDialog"
import DeleteCategoryDialog from "@/components/dialog/DeleteCategoryDialog"

interface CategoryManagementSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CategoryManagementSheet({ 
  open, 
  onOpenChange 
}: CategoryManagementSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl">Manage Categories</SheetTitle>
          <SheetDescription>
            Manage your income and expense categories
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col gap-4">
          <CategoryList type="income" />
          <CategoryList type="expense" />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () => 
      fetch(`/api/categories?type=${type}`).then((res) => res.json())
  })

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "rounded-xl p-3",
              type === "expense" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
            )}>
              {type === "expense" ? (
                <TrendingDown className="h-6 w-6"/>
              ) : (
                <TrendingUp className="h-6 w-6"/>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {type === "income" ? "Income" : "Expense"} Categories
              </h3>
              <p className="text-sm text-muted-foreground">
                {dataAvailable ? `${categoriesQuery.data.length} categories` : 'No categories yet'}
              </p>
            </div>
          </div>

          <CreateCategoryDialog 
            type={type}
            successCallback={() => categoriesQuery.refetch()}
            trigger={
              <Button 
                size="sm" 
                className={cn(
                  "gap-2 px-4",
                  type === "expense" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                <PlusSquare className="h-4 w-4"/>
                Add New
              </Button>
            }
          />
        </div>

        {!dataAvailable ? (
          <div className={cn(
            "flex h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed",
            type === "expense" ? "border-red-200" : "border-emerald-200"
          )}>
            <p className="font-medium">
              No
              <span className={cn(
                "mx-1.5 font-semibold",
                type === "income" ? "text-emerald-600" : "text-red-600"
              )}>
                {type}
              </span>
              categories yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click "Add New" to create your first category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard key={category.name} category={category} type={type} />
            ))}
          </div>
        )}
      </div>
    </SkeletonWrapper>
  )
}

function CategoryCard({ category, type }: { category: Category, type: string }) {
  return (
    <div className={cn(
      "group relative flex flex-col rounded-xl border bg-white transition-all hover:shadow-md",
      type === "expense" ? "hover:border-red-200" : "hover:border-emerald-200"
    )}>
      <div className="flex flex-col items-center gap-3 p-4">
        <span className="text-3xl transition-transform group-hover:scale-110" role="img">
          {category.icon}
        </span>
        <span className="font-medium">{category.name}</span>
      </div>
      <DeleteCategoryDialog 
        category={category} 
        trigger={
          <Button 
            variant="ghost" 
            className={cn(
              "w-full rounded-t-none border-t py-3 text-muted-foreground transition-colors",
              type === "expense" 
                ? "hover:bg-red-50 hover:text-red-600 group-hover:border-red-200" 
                : "hover:bg-emerald-50 hover:text-emerald-600 group-hover:border-emerald-200"
            )}
          >
            <TrashIcon className="h-4 w-4 mr-2"/>
            Remove
          </Button>
        }
      />
    </div>
  )
}