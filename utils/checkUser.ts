import { currentUser } from "@clerk/nextjs/server"
import prisma from "./db"

export const checkUser = async () => {
   const user =  await currentUser()

   if(!user) return null

}