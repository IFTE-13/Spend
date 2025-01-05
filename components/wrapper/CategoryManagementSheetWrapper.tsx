"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import CategoryManagementSheet from "@/components/sheet/CategoryManagementSheet"
import { ChartBarStacked } from "lucide-react"

export default function CategoryManagementSheetWrapper() {
  const [open, setOpen] = useState(false)

  return (
    <>
        <Button variant={"outline"} onClick={() => setOpen(true)}>
          <ChartBarStacked className='text-red-500'/>
          Manage Categories
        </Button>
        <CategoryManagementSheet open={open} onOpenChange={setOpen} />
    </>
  )
}