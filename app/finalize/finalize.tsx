"use client";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import idl from "../../idl/anchor_escrow.json";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import React, { FC, useEffect, useState, } from "react";
import { shortenWalletAddress } from "@/lib/funtions";
import { toast } from "sonner";
import { useEscrow } from "@/hooks/useEscrow";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DisplayTokenAmount from "@/components/DisplayTokenAmount";

let idl_string = JSON.stringify(idl);
let idl_object = JSON.parse(idl_string);

interface EscrowAccount {
    publicKey: PublicKey;
    account: {
      seed: BN;
      maker: PublicKey;
      bump: number;
      mintA: PublicKey;
      mintB: PublicKey;
      receive: BN;
    };
  }

const FinalizeContract = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { refundEscrow, takerEscrow, getAllEscrowAccounts, getMintInfo } = useEscrow() || {};
  const [escrows, setEscrows] = useState<EscrowAccount[]>([]);
  const [mintAInfo, setMintAInfo] = React.useState<any>(null);

  const fetchEscrows = async () => {
    if (!getAllEscrowAccounts) {
        toast.error("Escrow function not available");
        return;
      }
    const fetchedEscrows = await getAllEscrowAccounts();
    
    setEscrows(fetchedEscrows);
  };

  const fetchMintAInfo = async (mintA: PublicKey) => {
    if (!getMintInfo) {
      toast.error("Mint info function not available");
      return;
    }
    const mintInfo = await getMintInfo(mintA);
    setMintAInfo(mintInfo);
  };

  useEffect(() => {
    fetchEscrows();
  }, []);

  useEffect(() => {
    if (escrows.length > 0) {
      fetchMintAInfo(escrows[0].account.mintA); // Pass the first escrow's mintA publicKey
    }
  }, [escrows]);

  async function handleRefundEscrow(escrow: PublicKey) {
    if (!publicKey) {
      toast.error("Wallet not connected");
      return;
    }
    if (!refundEscrow) {
        toast.error("Escrow function not available");
        return;
      }
    try {
      await refundEscrow(escrow);
      toast.success("Escrow refunded successfully");
      await fetchEscrows();
    } catch (error) {
      console.error("Error refunding escrow:", error);
      toast.error("Failed to refund escrow");
    }
  }

  async function handleTakerEscrow(escrow: PublicKey) {
    if (!publicKey) {
      toast.error("Wallet not connected");
      return;
    }
    if (!takerEscrow) {
        toast.error("Escrow function not available");
        return;
      }
    try {
      await takerEscrow(escrow);
      toast.success("Escrow taken successfully");
      await fetchEscrows();
    } catch (error) {
      console.error("Error taking escrow", error);
      toast.error("Failed to take escrow");
    }
  }
 

  return escrows.length > 0 ? (
  <div className=" grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {escrows.map((value) => {
        const mintTakerKey = `mintTaker-${value.publicKey.toBase58()}`;
        const mintReceiverKey = `mintReceiver-${value.publicKey.toBase58()}`;
        return (
            <Card key={value.account.maker.toBase58()}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
            Escrow
          </div>
                    </CardTitle>
                </CardHeader>
                
                <CardContent>
                <Separator />
                    <div className="flex flex-col space-x-4">
                    <div>
                  <h2 className="mb-2 flex items-center gap-2 text-xl text-muted-foreground">
                    To Receive:
                  </h2>{" "}
                  <span className="px-2 text-4xl text-black dark:text-white">
                 
                 <DisplayTokenAmount
                 amount={value.account.receive.toString()}
                 decimals={mintAInfo?.decimals}
                 />
                  </span>
                </div>

                  <div className=" space-x-2">
                    <div className="flex space-x-2">
                    <h2 className="text-base text-muted-foreground">
                      Mint Taker:{" "}
                    </h2>
                    <span className="text-black dark:text-white">
                      {shortenWalletAddress(value.account.mintA.toBase58())}
                    </span>
                    </div>
                    <div className="flex space-x-2">
                    <h2 className="text-base text-muted-foreground">
                      Mint Receiver:{" "}
                    </h2>
                    <span className="text-black dark:text-white">
                      {shortenWalletAddress(value.account.mintB.toBase58())}
                    </span>
                    </div>
                  </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className=" w-full">
                        {publicKey?.toBase58() === value.account.maker.toBase58() && (
                            <div className=" flex justify-between space-x-3">
                                <Button
                            className="w-full"   
                      variant="secondary"
                      size="lg"
                      onClick={() => handleRefundEscrow(value.publicKey)}
                    >
                      Refund
                    </Button>
                            </div>
                        )}
                        {publicKey?.toBase58() !== value.account.maker.toBase58() && (
                  <Button
                  className="w-full" 
                    variant="default"
                    onClick={() => handleTakerEscrow(value.publicKey)}
                  >
                    Take
                  </Button>
                )}
                    </div>
                </CardFooter>
            </Card>
        )
    })}
  </div>
  ): (
    <div className="text-center">
      <h2 className="mx-auto">No Escrows to Display Yet</h2>
    </div>
  )
};

export default FinalizeContract;