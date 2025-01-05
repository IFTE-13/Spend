"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Period, Timeframe } from "@/lib/types"
import { useState } from "react"
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/wrapper/SkeletonWrapper";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"
import { cn } from "@/lib/utils";
import CountUp from "react-countup";

export default function History() {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  })

  const historyDataQuery = useQuery({
    queryKey: ["overview", "history", timeframe, period],
    queryFn: () => fetch(
        `/api/history-data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`
    ).then((res) => res.json())
    })

    const dataAvailable = historyDataQuery.data && historyDataQuery.data.length > 0;


  return (
    <div className="container mx-auto my-4">
        <h2 className="my-4 text-3xl font-bold">History</h2>
        <Card>
            <CardHeader className="gap-2">
                <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
                    <HistoryPeriodSelector period={period} setPeriod={setPeriod} timeframe={timeframe} setTimeframe={setTimeframe} />
                    <div className="flex h-10 gap-2">
                        <Badge variant={"outline"} className="flex items-center gap-2 text-sm">
                            <div className="h-4 w-4 bg-emerald-500 rounded-full"></div>
                            Income
                        </Badge>
                        <Badge variant={"outline"} className="flex items-center gap-2 text-sm">
                            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                            Expense
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
                    {
                        dataAvailable && 
                        <ResponsiveContainer width={"100%"} height={300}>
                            <BarChart height={300} data={historyDataQuery.data} barCategoryGap={5}>
                                <defs>
                                    <linearGradient id="incomeBar" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="expenseBar" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                                        <stop offset="1000%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray={"5 5"} strokeOpacity={"0.2"} vertical={false} />
                                <XAxis 
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                padding={{left: 5, right: 5}}
                                dataKey={(data) => {
                                    const {year, month, day} = data;
                                    if(timeframe === "year") {
                                        return new Date(year, month).toLocaleString("default", {
                                            month: "short"
                                        });
                                    }
                                    return day;
                                }}
                                />
                                <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                />
                                <Bar 
                                dataKey={"income"} 
                                label="Income" 
                                fill="url(#incomeBar)"
                                radius={4}
                                className="cursor-pointer"
                                />
                                <Bar 
                                dataKey={"expense"} 
                                label="Expense" 
                                fill="url(#expenseBar)"
                                radius={4}
                                className="cursor-pointer"
                                />
                                <Tooltip 
                                cursor={{ opacity: 0.1 }}
                                content={props => (
                                    <CustomTooltip {...props}/>
                                )}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    }
                    {
                        !dataAvailable && <div className="flex h-[300px] justify-center items-center flex-col bg-background">
                            <p>No data for the selected Period</p>
                        <p className="text-sm text-muted-foreground">
                            Try selecting a different period or adding new transactions
                        </p>
                        </div>
                    }
                </SkeletonWrapper>
            </CardContent>
        </Card>
    </div>
  )
}

function CustomTooltip({ active, payload }: any) {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    const { expense, income } = data;

    return (
        <div className="min-w-[300px] rounded border bg-background p-4">
            <TooltipRow label="Expense" value={expense} bgColor="bg-red-500" textColor="text-red-500" />
            <TooltipRow label="Income" value={income} bgColor="bg-emerald-500" textColor="text-emerald-500" />
            <TooltipRow label="Balance" value={income - expense} bgColor="bg-gray-500" textColor="text-foreground" />
        </div>
    );
}

function TooltipRow({
    label,
    value,
    bgColor,
    textColor
}: {
    label: string;
    value: number;
    bgColor: string;
    textColor: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <div className={cn("h-4 w-4 rounded-full", bgColor)} />
            <div className="flex w-full justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className={cn("text-sm font-bold", textColor)}>
                    <CountUp
                        duration={0.5}
                        preserveValue
                        end={value}
                        decimals={0}
                        className="text-sm"
                    />
                </div>
            </div>
        </div>
    );
}