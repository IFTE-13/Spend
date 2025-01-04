"use client"

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import StatsCard from "./StatsCard";
import CategoriesStats from "./CategoriesStats";

export default function OverView({}) {
  const [dateRange, setDateRange] = useState<{from: Date; to:Date}>({
    from: startOfMonth(new Date()),
    to: new Date()
  })
  console.log(dateRange)
  return (
    <>
        <div className="container mx-auto flex flex-wrap items-end justify-between gap-2 py-6">
            <h2 className="text-3xl font-bold">Overview</h2>
            <div className="flex items-center gap-3">
                <DateRangePicker 
                initialDateFrom={dateRange.from}
                initialDateTo={dateRange.to}
                showCompare={false}
                onUpdate={values => {
                    const {from, to} = values.range

                    if(!from || !to) return;

                    if(differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                        toast.error(
                            `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days`
                        )
                        return;
                    }

                    setDateRange({from, to})
                }}
                />
            </div>
        </div>
        <div className="container mx-auto w-full flex-col gap-2">
            <StatsCard
                from={dateRange.from}
                to={dateRange.to}
            />
            <CategoriesStats
                from={dateRange.from}
                to={dateRange.to}
            />
        </div>
    </>
  )
}
