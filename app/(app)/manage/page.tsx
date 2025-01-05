"use client"

import SkeletonWrapper from "@/components/SkeletonWrapper"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionType } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from "lucide-react"
import CreateCategoryDialog from "../dashboard/_components/CreateCategoryDialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Category } from "@prisma/client"
import DeleteCategoryDialog from "./_components/DeleteCategoryDialog"

export default function page() {
  return (
    <>
        <div className="border-b bg-card">
            <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 py-8">
                <div>
                    <p className="text-3xl font-bold">
                        Manage
                    </p>
                    <p className="text-muted-foreground">
                        Manage your categories
                    </p>
                </div>
            </div>
        </div>
        <div className="container mx-auto flex flex-col gap-4 p-4">
            <CategoryList type="income"/>
            <CategoryList type="expense"/>
        </div>
    </>
  )
}

function CategoryList({type} : {type : TransactionType}){
    const categoriesQuery = useQuery({
        queryKey: ["categories", type],
        queryFn: () => 
            fetch(`/api/categories?type=${type}`).then((res) => res.json())
    })

    const dataAvaildable = categoriesQuery.data && categoriesQuery.data.length > 0;

    return (
        <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            {type === "expense" ? <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500"/> : (
                                <TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500"/>
                            )}
                            <div>
                                { type === "income" ? "Incomes" : "Expenses"} Categories
                                <div className="text-sm text-muted-foreground">
                                    Sorted by name
                                </div>
                            </div>
                        </div>

                        <CreateCategoryDialog 
                        type={type} 
                        successCallback={() => categoriesQuery.refetch()} 
                        trigger={
                            <Button className="text-sm gap-2">
                                <PlusSquare className="h-4 w-4"/>
                                Create Category
                            </Button>
                        }
                        />
                    </CardTitle>
                </CardHeader>
                {
                    !dataAvaildable && (
                        <div className="flex h-40 w-full flex-col items-center justify-center">
                            <p>
                                No
                                <span className={cn(
                                    "m-1",
                                    type === "income" ? "text-emerald-500" : "text-red-500"
                                )}>
                                    {type}
                                </span> categories yet
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Create one to get started
                            </p>
                        </div>
                    )
                }

                {
                    dataAvaildable && (
                        <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {
                                categoriesQuery.data.map((category: Category) => (
                                    <CategoryCard category={category} key={category.name} />
                                ))
                            }
                        </div>
                    )
                }
            </Card>
        </SkeletonWrapper>
    )
}

function CategoryCard({category}: {category: Category}){
    return (
        <div className="flex border-seperator flex-col justify-between rounded-md border shadow-md shadow-black/[0.1]">
            <div className="flex flex-col items-center gap-4 p-4">
                <span className="text-3xl" role="img">
                    {category.icon}
                </span>
                <span>{category.name}</span>
            </div>
            <DeleteCategoryDialog category={category} trigger={
                <Button className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20" variant={"secondary"}>
                    <TrashIcon className="h-4 w-4"/>
                    Remove
                </Button>
            }/>
        </div>
    )
}