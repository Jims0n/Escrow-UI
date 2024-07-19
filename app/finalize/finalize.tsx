import Link from "next/link";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import idl from "../../idl/anchor_escrow.json"
import { AnchorEscrow } from "../../idl/anchor_escrow";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { FC, useEffect, useState } from "react";


import { getAssociatedTokenAddressSync, getAccount, TOKEN_PROGRAM_ID, getMint, ASSOCIATED_TOKEN_PROGRAM_ID} from "@solana/spl-token";

let idl_string = JSON.stringify(idl)
let idl_object = JSON.parse(idl_string)

type EscrowAccount = {
    escrow: PublicKey;
    mintA: PublicKey;
    mintB: PublicKey;
    seed: BN;
    recieve: BN;
    makerAmount: BN;
    maker: PublicKey
}

const FinalizeContract = () => {

    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const anchorWallet = useAnchorWallet()

    const [takeDetails, setTakeDetails] = useState<(EscrowAccount | undefined)[]>()


    const getCurrentEscrowAccountsForDeal = async() => {
        if(!anchorWallet) {return;}
        const provider = new AnchorProvider(connection, anchorWallet)
        const program = new Program<AnchorEscrow>(idl_object, provider)
        // setProgram(program)
        const data = await program.account.escrow.all();
        let escrowAccounts: EscrowAccount[] = []
        for(let i=0;i<data.length;i++) {
            const y = getAssociatedTokenAddressSync(data[i].account.mintA, data[i].publicKey, true, TOKEN_PROGRAM_ID)
            const account = await connection.getTokenAccountBalance(y)
            const balance = Number(account.value.amount)/10**account.value.decimals
            const mintInfoB = await getMint(connection, data[i].account.mintB)
            const recieveAmt = data[i].account.receive/10**mintInfoB.decimals
            escrowAccounts.push({
                escrow: data[i].publicKey,
                mintA: data[i].account.mintA,
                mintB: data[i].account.mintB,
                seed: data[i].account.seed,
                recieve: recieveAmt,
                makerAmount: balance,
                maker: data[i].account.maker,
            })
        }
        setTakeDetails(escrowAccounts)
    }
   

    

    return (
        <div className="w-full max-w-5xl">
            {txn.map(tx => (
                
            ))}
        </div>
    );
}

export default FinalizeContract;