import { OverviewQuerySchema } from "@/schema/overview";
import prisma from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request){
    const user = await currentUser();
    
    if(!user) {
        redirect('/')
    }

    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const queryParams = OverviewQuerySchema.safeParse({ from, to })

    if(!queryParams.success) {
        return Response.json(queryParams.error.message, {
            status: 400
        })
    }

    const stats = await getCategoriesState(
        user.id,
        queryParams.data.from,
        queryParams.data.to
    )

    return Response.json(stats)
}

export type GetCategoryStatsResponseType = Awaited<ReturnType<typeof getCategoriesState>>
async function getCategoriesState(userId: string, from: Date, to: Date) {
    const stats = await prisma.transaction.groupBy({
        by: ["type", 'category', "categoryIcon"],
        where: {
            userId,
            date: {
                gte: from,
                lte: to
            }
        },
        _sum: {
            amount: true
        },
        orderBy: {
            _sum: {
                amount: "desc"
            }
        }
    })

    return stats;
}