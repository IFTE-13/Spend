"use client"

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/wrapper/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { ReactNode } from "react";
import CountUp from "react-countup"

interface Props {
    from: Date;
    to: Date;
}

export default function StatsCard({from, to}: Props) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () => fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json())
  })

  
  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  
  const balance = income - expense;
  
  console.log(DateToUTCDate(from))
  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
        <SkeletonWrapper isLoading={statsQuery.isFetching}>
            <StatCard 
            value={income}
            title="Income"
            icon={<TrendingUp className="h-12 w-12 items-center rounded-lg text-white bg-emerald-500"/>}
            />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={statsQuery.isFetching}>
            <StatCard 
            value={expense}
            title="Expense"
            icon={<TrendingDown className="h-12 w-12 items-center rounded-lg text-white bg-red-500"/>}
            />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={statsQuery.isFetching}>
            <StatCard 
            value={balance}
            title="Balance"
            icon={<Wallet className="h-12 w-12 items-center rounded-lg text-white bg-violet-500"/>}
            />
        </SkeletonWrapper>
    </div>
  )
}

function StatCard({ value, title, icon} : {
    icon: ReactNode;
    title: string;
    value: number;
}) {

    return (
        <Card className="flex h-24 w-full items-center gap-2 p-4">
            {icon}
            <div className="flex flex-col items-start gap-0">
                <p className="text-muted-foreground">{title}</p>
                <CountUp
                    preserveValue
                    redraw={false}
                    end={value}
                    decimals={2}
                    className="text-2xl"
                />
            </div>
        </Card>
    )
}
