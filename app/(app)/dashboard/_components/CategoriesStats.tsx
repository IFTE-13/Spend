import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import SkeletonWrapper from '@/components/wrapper/SkeletonWrapper';
import { DateToUTCDate } from '@/lib/helpers';
import { useQuery } from '@tanstack/react-query';
import { TransactionType } from '@/lib/types';
import { GetCategoryStatsResponseType } from '@/app/api/stats/categories/route';

interface Props {
    from: Date;
    to: Date;
}

export default function CategoriesStats({ from, to }: Props) {
    const statsQuery = useQuery<GetCategoryStatsResponseType>({
        queryKey: ['overview', 'stats', 'categories', from, to],
        queryFn: () => fetch(`/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json())
    });

    return (
        <div className='grid w-full gap-4 md:grid-cols-2 mt-4'>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <CategoriesCard
                    type="income"
                    data={statsQuery.data || []}
                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <CategoriesCard
                    type="expense"
                    data={statsQuery.data || []}
                />
            </SkeletonWrapper>
        </div>
    );
}

function CategoriesCard({ data, type }: { type: TransactionType, data: GetCategoryStatsResponseType }) {
    const filteredData = data.filter(el => el.type === type);
    const total = filteredData.reduce((acc, el) => acc + (el._sum?.amount || 0), 0);

    return (
        <Card className='h-[400px] transition-all hover:shadow-md'>
            <CardHeader className="pb-4">
                <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                    <div className={`h-2 w-2 rounded-full ${type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {type === "income" ? "Income" : "Expense"} Categories
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                        Total: {total.toLocaleString()} Tk
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-2">
                {filteredData.length === 0 ? (
                    <div className="flex h-60 w-full flex-col items-center justify-center text-center">
                        <div className="text-2xl font-semibold text-muted-foreground/50">No Data</div>
                        <p className='mt-2 text-sm text-muted-foreground'>
                            Try selecting a different period or add new {type === 'income' ? 'incomes' : 'expenses'}
                        </p>
                    </div>
                ) : (
                    <ScrollArea className='h-[300px] pr-4'>
                        <div className="flex w-full flex-col gap-6 p-4">
                            {filteredData.map((item) => {
                                const amount = item._sum.amount || 0;
                                const percentage = (amount * 100) / (total || amount);

                                return (
                                    <div 
                                        className='group flex flex-col gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50' 
                                        key={item.category}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-lg">
                                                    {item.categoryIcon}
                                                </span>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">
                                                        {item.category}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {percentage.toFixed(1)}% of total
                                                    </span>
                                                </div>
                                            </div>
                                            <span className='font-medium text-foreground'>
                                                {amount.toLocaleString()} Tk
                                            </span>
                                        </div>

                                        <Progress 
                                            value={percentage} 
                                            className={`h-2 ${
                                                type === "income" 
                                                    ? "bg-emerald-100 [&>div]:bg-emerald-500" 
                                                    : "bg-red-100 [&>div]:bg-red-500"
                                            }`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
