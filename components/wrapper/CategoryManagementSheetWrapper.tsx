"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import CategoryManagementSheet from "@/components/sheet/CategoryManagementSheet"

export default function CategoryManagementSheetWrapper() {
  const [open, setOpen] = useState(false)

  return (
    <>
        <Button variant={"outline"} onClick={() => setOpen(true)}>Manage Categories</Button>
        <CategoryManagementSheet open={open} onOpenChange={setOpen} />
    </>
  )
}