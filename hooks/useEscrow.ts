"use client";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import idl from "../idl/anchor_escrow.json";
import { AnchorEscrow } from "../idl/anchor_escrow";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { FC, useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  getAssociatedTokenAddressSync,
  getAccount,
  TOKEN_PROGRAM_ID,
  getMint,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID
} from "@solana/spl-token";
import { randomBytes } from "crypto";


export const useEscrow = () => {
    let idl_string = JSON.stringify(idl);
let idl_object = JSON.parse(idl_string);
    const { connection } = useConnection();
    const wallet = useWallet();
    const anchorWallet = useAnchorWallet();
    
    if (!anchorWallet) {
        console.error("Anchor wallet is not available");
        return;
    }
    const provider = new AnchorProvider(connection, anchorWallet, {commitment: "confirmed"});
   
    const program = new Program<AnchorEscrow>(idl_object, provider);
  
    const isToken2022 = async (mint: PublicKey) => {
        const mintInfo = await provider.connection.getAccountInfo(mint);
        return mintInfo?.owner.equals(TOKEN_2022_PROGRAM_ID);
      };
    
      const getMintInfo = async (mint: PublicKey) => {
        const tokenProgram = (await isToken2022(mint))
          ? TOKEN_2022_PROGRAM_ID
          : TOKEN_PROGRAM_ID;
    
        return getMint(provider.connection, mint, undefined, tokenProgram);
      };

      const getEscrowInfo = async (escrow: PublicKey) => {
        return program.account.escrow.fetch(escrow);
      };

      const getAllEscrowAccounts = async () => {
        if (!program) {
          throw new Error("Program not initialized");
        }
        const escrowAccounts = await program.account.escrow.all();
    
        return escrowAccounts;
      };

      const makeEscrow = async ({
        mintA,
        mintB,
        deposit,
        receive,
      }: {
        mintA: any;
    mintB: string;
    deposit: number;
    receive: number;
      }) => {
        if (!program) {
            throw new Error("Program not initialized");
        }
        if (!wallet.publicKey) {
            toast.error("Wallet not connected");
            return;
        }
        try {
            const seed = new BN(randomBytes(8));
            const tokenProgram = (await isToken2022(new PublicKey(mintA)))
            ? TOKEN_2022_PROGRAM_ID
            : TOKEN_PROGRAM_ID;

            const makerAtaA =  getAssociatedTokenAddressSync(
                new PublicKey(mintA),
                wallet.publicKey,
                false,
                tokenProgram,
            );

            const [escrow] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("escrow"),
                    wallet.publicKey.toBuffer(),
                    seed.toArrayLike(Buffer, "le", 8),
                ],
                program.programId
            );

            const vault = getAssociatedTokenAddressSync(
                new PublicKey(mintA),
                escrow,
                true,
                tokenProgram
            );

            

            const mintAInfo = await getMintInfo(new PublicKey(mintA));
            const mintAAmount = new BN(deposit).mul(
                new BN(10).pow(new BN(mintAInfo.decimals)),
            );
            const mintBInfo = await getMintInfo(new PublicKey(mintB));
            const mintBAmount = new BN(receive).mul(
                new BN(10).pow(new BN(mintBInfo.decimals)),
            );
            
            console.log(
                wallet.publicKey.toString(),
                new PublicKey(mintA).toBase58(),
                new PublicKey(mintB).toBase58(),
                mintAAmount,
                mintBAmount,
                makerAtaA.toBase58(),
                vault.toBase58(),
                tokenProgram.toBase58()
            );

            return program.methods
                .make(seed, mintAAmount, mintBAmount)
                .accountsPartial({
                    maker: wallet.publicKey,
                    mintA: mintA,
                    mintB: new PublicKey(mintB),
                    makerAtaA,
                    vault,
                    tokenProgram
                })
                .rpc();
            
        } catch (error) {
            toast.error("Error creating escrow");
            console.log(error);
            
        }
      };

    const refundEscrow = async (escrow: PublicKey) => {
        if (!program) {
            throw new Error("Program not initialized")
        }

        try {
            const escrowAccount = await getEscrowInfo(escrow);

            const tokenProgram = (await isToken2022(escrowAccount.mintA))
                ? TOKEN_2022_PROGRAM_ID
                : TOKEN_PROGRAM_ID;

            const makerAtaA = getAssociatedTokenAddressSync(
                new PublicKey(escrowAccount.mintA),
                escrowAccount.maker,
                false,
                tokenProgram
            )

            const vault = getAssociatedTokenAddressSync(
                new PublicKey(escrowAccount.mintA),
                escrow,
                true,
                tokenProgram
            );

            return program.methods
                .refund()
                .accountsPartial({
                    maker: escrowAccount.maker,
                    mintA: new PublicKey(escrowAccount.mintA),
                    vault,
                    makerAtaA,
                    escrow,
                    tokenProgram,
                })
                .rpc();
            
        } catch (error) {
            toast.error("Error refunding escrow");
            console.error(error);
        }
    };

    const takerEscrow = async (escrow: PublicKey) => {
        if (!program) {
            throw new Error("Program not initialized");
        }
        if (!wallet.publicKey) {
            toast.error("Wallet not connected");
            return;
        }

        try {
            const escrowAccount = await getEscrowInfo(escrow);

            const tokenProgram = (await isToken2022(escrowAccount.mintA))
                ? TOKEN_2022_PROGRAM_ID
                : TOKEN_PROGRAM_ID;
                
            const makerAtaB = getAssociatedTokenAddressSync(
                new PublicKey(escrowAccount.mintB),
                escrowAccount.maker,
                false,
                tokenProgram,
            );

            const vault = getAssociatedTokenAddressSync(
                new PublicKey(escrowAccount.mintA),
                wallet.publicKey,
                false,
                tokenProgram
            );

            const takerAtaA = getAssociatedTokenAddressSync(
                new PublicKey(escrowAccount.mintA),
                wallet.publicKey,
                false,
                tokenProgram,
              );
              const takerAtaB = getAssociatedTokenAddressSync(
                new PublicKey(escrowAccount.mintB),
                wallet.publicKey,
                false,
                tokenProgram,
              );

              return program.methods
                .take()
                .accountsPartial({
                    maker: escrowAccount.maker,
                    mintA: new PublicKey(escrowAccount.mintA),
                    mintB: new PublicKey(escrowAccount.mintB),
                    makerAtaB,
                    takerAtaA,
                    takerAtaB,
                    escrow,
                    tokenProgram,
                    vault
                })
                .rpc();
        } catch (error) {
            toast.error("Error taking escrow");
            console.error(error)
        }
    };

      return {
        program,
        makeEscrow,
        refundEscrow,
    getEscrowInfo,
    takerEscrow,
    getAllEscrowAccounts,
    getMintInfo,
      };
    
};