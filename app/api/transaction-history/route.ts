import { OverviewQuerySchema } from "@/schema/overview";
import prisma from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = await currentUser();

    if(!user) {
        redirect('/')
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const queryParams = OverviewQuerySchema.safeParse({ from, to })

    if(!queryParams.success) {
        return Response.json(queryParams.error.message, {
            status: 400
        })
    }

    const tranactions = await getTransactionHistory(
        user.id,
        queryParams.data.from,
        queryParams.data.to
    )

    return Response.json(tranactions)
}

export type GetTransactionHistoryResponseType = Awaited<ReturnType<typeof getTransactionHistory>>
async function getTransactionHistory(userId: string, from: Date, to: Date) {
    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: from,
                lte: to
            }
        },
        orderBy: {
            date: "asc"
        }
    })

    return transactions.map((transaction) => ({
        ...transaction
    }))
}