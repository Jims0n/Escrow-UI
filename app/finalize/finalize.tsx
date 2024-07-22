"use client";

import Link from "next/link";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import idl from "../../idl/anchor_escrow.json";
import { AnchorEscrow } from "../../idl/anchor_escrow";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { FC, useEffect, useState } from "react";

import {
  getAssociatedTokenAddressSync,
  getAccount,
  TOKEN_PROGRAM_ID,
  getMint,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import Table from "@/components/Card/Table";

let idl_string = JSON.stringify(idl);
let idl_object = JSON.parse(idl_string);

type EscrowAccount = {
  escrow: PublicKey;
  mintA: PublicKey;
  mintB: PublicKey;
  seed: BN;
  recieve: BN;
  makerAmount: BN;
  maker: PublicKey;
};

const FinalizeContract = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  
    const ourWallet = useAnchorWallet()
    const [escrowAccounts, setEscrowAccounts] = useState<(EscrowAccount | undefined)[]>()
    const [loading, setLoading] = useState(true)

  const [takeDetails, setTakeDetails] =
    useState<(EscrowAccount | undefined)[]>();

  const getCurrentEscrowAccountsForDeal = async () => {
    if (!anchorWallet) {
      return;
    }
    const provider = new AnchorProvider(connection, anchorWallet);
    const program = new Program<AnchorEscrow>(idl_object, provider);
    // setProgram(program)
    const data = await program.account.escrow.all();
    let escrowAccounts: EscrowAccount[] = [];
    for (let i = 0; i < data.length; i++) {
      const y = getAssociatedTokenAddressSync(
        data[i].account.mintA,
        data[i].publicKey,
        true,
        TOKEN_PROGRAM_ID,
      );
      const account = await connection.getTokenAccountBalance(y);
      const balance =
        Number(account.value.amount) / 10 ** account.value.decimals;
      const mintInfoB = await getMint(connection, data[i].account.mintB);
      const recieveAmt = data[i].account.receive / 10 ** mintInfoB.decimals;
      escrowAccounts.push({
        escrow: data[i].publicKey,
        mintA: data[i].account.mintA,
        mintB: data[i].account.mintB,
        seed: data[i].account.seed,
        recieve: recieveAmt,
        makerAmount: balance,
        maker: data[i].account.maker,
      });
    }
    setTakeDetails(escrowAccounts);
  };

  useEffect(() => {
    setLoading(true)
    const data: (EscrowAccount | undefined)[] | undefined =  takeDetails
    if(data?.length) {
        setEscrowAccounts(data)
        console.log(escrowAccounts)
    } 
    console.log(data)
    setLoading(false)
},[takeDetails])

const truncate = (str: String | undefined) => str ? (str.slice(0,4)+"..."+str.slice(-4)) : null

  return (
    <div className="w-full max-w-5xl">
      {
                        escrowAccounts && 
                        escrowAccounts.map((escrowAccount, i) => (
                            <Table 
                            key={i}
                            escrow={`https://explorer.solana.com/address/${escrowAccount?.escrow.toString()}?cluster=devnet`} 
                            mintA={truncate(escrowAccount?.mintA.toString())} 
                            mintB={truncate(escrowAccount?.mintB.toString())} 
                            mintAUrl={escrowAccount?.mintA.toString()}
                            mintBUrl={escrowAccount?.mintB.toString()}
                            maker={truncate(escrowAccount?.escrow.toString())}
                            makerAmount={(escrowAccount?.makerAmount.toString())}
                            takerAmount={(escrowAccount?.recieve.toString())}
                            deal={async () => {
                                if(!ourWallet) {return alert("Wallet not connected");}
                                const provider = new AnchorProvider(connection, ourWallet)
                                const program = new Program<AnchorEscrow>(idl_object, provider)
                                if(!escrowAccount){return}
                                const makerAtaB = getAssociatedTokenAddressSync(escrowAccount?.mintB, escrowAccount?.maker,false, TOKEN_PROGRAM_ID)
                                const takerAtaA = getAssociatedTokenAddressSync(escrowAccount.mintA, ourWallet.publicKey, false, TOKEN_PROGRAM_ID)
                                const takerAtaB = getAssociatedTokenAddressSync(escrowAccount.mintB, ourWallet.publicKey, false, TOKEN_PROGRAM_ID)
                                const vault = getAssociatedTokenAddressSync(escrowAccount.mintA, escrowAccount.escrow, true, TOKEN_PROGRAM_ID)
                                console.log(takerAtaB.toString())
                                try {

                                    const tx = await program.methods.take()
                                    .accountsStrict({
                                        makerAtaB,
                                        takerAtaA,
                                        takerAtaB,
                                        vault,
                                        tokenProgram: TOKEN_PROGRAM_ID,
                                        taker: ourWallet.publicKey,
                                        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                                        escrow: escrowAccount.escrow,
                                        maker: escrowAccount.maker,
                                        mintA: escrowAccount.mintA,
                                        mintB: escrowAccount.mintB,
                                        systemProgram: SystemProgram.programId
                                    })
                                    .rpc()
                                    console.log(tx)
                                    alert("Tx Successful. Check console for Txid")
                                } catch(e) {
                                    alert("Something went wrong. Check console for error")
                                    console.log(e)
                                }
                            }}
                            />
                        ))
                    }
    </div>
  );
};

export default FinalizeContract;
