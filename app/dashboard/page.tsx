import { Button } from '@/components/ui/button';
import { requireUser } from '@/utils/hook'
import { currentUser } from '@clerk/nextjs/server';
import { ArrowBigDownDash, ArrowBigUpDash } from 'lucide-react';
import React from 'react'
import CreateTransactionsDialog from './_components/CreateTransactionsDialog';
import OverView from './_components/OverView';
import History from './_components/History';

async function page() {
  requireUser();

  const user = await currentUser();
  
  return (
    <div className='h-full bg-background'>
      <div className="border-b bg-card">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-6 py-8">
          <p className="text-3xl font-bold">
            Hello, {user?.firstName}
          </p>
          <div className="flex items-center gap-3">
            <CreateTransactionsDialog 
            trigger= {
                  <Button variant={"outline"}>
                    <ArrowBigDownDash className='text-emerald-500'/>
                    Income
                  </Button>
            }
            type={"income"}
            />
            <CreateTransactionsDialog 
            trigger={
                  <Button variant={"outline"}>
                    <ArrowBigUpDash className='text-red-500'/>
                    Expense
                  </Button>
            }
            type={"expense"}
            />
          </div>
        </div>
      </div>
      <OverView />
      <History />
    </div>
  )
}

export default page