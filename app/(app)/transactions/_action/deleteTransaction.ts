"use server"

import prisma from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function DeleteTransaction(id: string) {
    const user = await currentUser();
    if(!user) {
        redirect("/sign-in")
    }

    const transaction = await prisma.transaction.findUnique({
        where: {
            userId: user.id,
            id
        }
    })

    if(!transaction) {
        throw new Error("Bad Request")
    }

    await prisma.$transaction([
        // delete user transaction
        prisma.transaction.delete({
            where: {
                userId: user.id,
                id
            }
        }),

        // Update month aggregates table
        prisma.monthHistory.update({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: transaction.date.getUTCDate(),
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear()
                }
            },
            data: {
                ...(transaction.type === "expense" && {
                    expense: {
                        decrement: transaction.amount
                    }
                }),
                ...(transaction.type === "income" && {
                    expense: {
                        decrement: transaction.amount
                    }
                })
            }
        }),

        // Update year aggregates table
        prisma.yearHistory.update({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear()
                }
            },
            data: {
                ...(transaction.type === "expense" && {
                    expense: {
                        decrement: transaction.amount
                    }
                }),
                ...(transaction.type === "income" && {
                    expense: {
                        decrement: transaction.amount
                    }
                })
            }
        })
    ])
}