
"use client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { useEscrow } from "@/hooks/useEscrow";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from 'react';

export default function Home() {
    const {getAllEscrowAccounts} = useEscrow() || {};
    const [escrowCount, setEscrowCount] = useState(0);

    useEffect(() => {
        async function fetchEscrowAccounts() {
            if (getAllEscrowAccounts) {
                const accounts = await getAllEscrowAccounts();
                setEscrowCount(accounts.length);
            }
        }
        fetchEscrowAccounts();
    }, [getAllEscrowAccounts]);

  return (
    <>
      <Head>
        <title>Deposito</title>
        <meta name="description" content="An escrow marketplace" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col mt-36 container items-center min-h-screen">
        <div className="px-4 md:px-4 mb-10 md:mb-20 w-full justify-end flex gap-10 ">
          <Link
            href="/finalize"
            className="w-fit px-10 p-4 bg-green-200 border-black text-white rounded-lg font-bold border"
          >
            Incoming Transactions
          </Link>
          {/* <button className="w-full p-4 bg-primary-700 text-white rounded-lg font-bold border">Finalize</button> */}
        </div>

        <Card x-chunk="dashboard-05-chunk-1">
      <CardHeader className="pb-2">
        <CardDescription>Escrow count</CardDescription>
        <CardTitle className="text-4xl">
          {escrowCount}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">+25% from last week</div>
      </CardContent>
      <CardFooter>
        <Progress value={75} aria-label="25% increase" />
        
      </CardFooter>
    </Card>
        
        <div className="px-4 py-8 md:px-4 mb-10 md:mb-20 w-full justify-center flex gap-10 ">
          <Link
            href="/new"
            className="w-fit px-10 p-4 bg-black border-black text-white rounded-lg font-bold border"
          >
            New Escrow Transactions
          </Link>
        </div>
      </div>
    </>
  );
}