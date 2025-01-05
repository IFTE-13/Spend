import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/wrapper/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { ReactNode } from "react";
import CountUp from "react-countup";

interface Props {
    from: Date;
    to: Date;
}

export default function StatsCard({ from, to }: Props) {
    const statsQuery = useQuery<GetBalanceStatsResponseType>({
        queryKey: ["overview", "stats", from, to],
        queryFn: () => fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json()),
    });

    const income = statsQuery.data?.income || 0;
    const expense = statsQuery.data?.expense || 0;
    const balance = income - expense;

    return (
        <div className="relative flex w-full flex-wrap gap-4 md:flex-nowrap">
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard
                    value={income}
                    title="Income"
                    icon={
                        <TrendingUp className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 p-2 text-white shadow-md" />
                    }
                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard
                    value={expense}
                    title="Expense"
                    icon={
                        <TrendingDown className="h-12 w-12 rounded-lg bg-gradient-to-br from-red-400 to-pink-500 p-2 text-white shadow-md" />
                    }
                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard
                    value={balance}
                    title="Balance"
                    icon={
                        <Wallet className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-400 to-violet-500 p-2 text-white shadow-md" />
                    }
                />
            </SkeletonWrapper>
        </div>
    );
}

function StatCard({ value, title, icon }: { icon: ReactNode; title: string; value: number }) {
    return (
        <Card className="flex h-28 w-full items-center gap-4 p-6 bg-gradient-to-b from-white to-gray-50 shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-center">{icon}</div>
            <div className="flex flex-col items-start gap-1">
                <p className="text-lg font-semibold text-gray-600">{title}</p>
                <CountUp
                    preserveValue
                    redraw={false}
                    end={value}
                    decimals={2}
                    className="text-3xl font-bold text-gray-800"
                />
            </div>
        </Card>
    );
}
