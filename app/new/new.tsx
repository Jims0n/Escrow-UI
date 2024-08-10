"use client";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddressSync,
  // TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { AccountInfo, PublicKey, SystemProgram } from "@solana/web3.js";
import { FC, useEffect, useState } from "react";
import idl from "../../idl/anchor_escrow.json";
import { AnchorEscrow } from "../../idl/anchor_escrow";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { randomBytes } from "crypto";
import { TailSpin } from "react-loader-spinner";
import { useEscrow } from "@/hooks/useEscrow";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



const NewEscrowForm = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { makeEscrow } = useEscrow() || {};
  const router = useRouter();
  const [coinList, setCoinList] = useState<
    {
      account: AccountInfo<Buffer>;
      pubkey: PublicKey;
    }[]
  >();
  const [selectedToken, setSelectedToken] = useState<{
    pubkey: PublicKey;
    balance: Number;
  }>();
  const [amount, setAmount] = useState(0);
  const [recieverMint, setRecieverMint] = useState("");
  const [expectedAmount, setExpectedAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAllTokens = async () => {
    if (publicKey) {
      const tokenAccounts = await connection.getTokenAccountsByOwner(
        publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        },
      );
      let tokenDetails = tokenAccounts.value.map((account) => account);
      setCoinList(tokenDetails);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchAllTokens();

    setLoading(false);
    
    console.log();
  }, []);

  

  const onSubmit = async () => {
    if (!publicKey) {
        toast.error("Wallet not connected");
        return;
      }
      if (!makeEscrow) {
        toast.error("Escrow function not available");
        return;
      }
      console.log(selectedToken?.pubkey.toString());
      if (!selectedToken?.pubkey) {
        toast.error("No token selected");
        return;
      }
      const mint = (await getAccount(connection, selectedToken?.pubkey)).mint
      await makeEscrow({
        mintA: mint,
        mintB: recieverMint,
        deposit: amount,
        receive: expectedAmount,
      });  
      
      toast.success("Escrow creation successful", {
        description: "Go to On-going to view your escrow",
        position: "bottom-center",
        action: {
          label: "On-going",
          onClick: () => router.push("/finalize"),
        },
      });
  }
  


  return (
    <div>
      <section className="bg-white py-4 dark:bg-gray-900 rounded-md">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-center w-full h-full flex-col">
              {coinList ? (
                <div className="flex flex-col w-full px-10">
                  <div className="flex flex-col w-full">
                  <select 
                  onChange={(e) => {
                        (async () => {
                          if (Number(e.target.value) === 0) {
                            return;
                          }
                          let balance = await connection.getTokenAccountBalance(
                            new PublicKey(e.target.value),
                          );
                          setSelectedToken({
                            pubkey: new PublicKey(e.target.value),
                            balance:
                              Number(balance.value.amount) /
                              10 ** balance.value.decimals,
                          });
                        })();
                      }}
                      name="Select token"
                      defaultValue="--Select Token--"
                      id="large" className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option>--- Select Token ---</option>
                      {coinList.length &&
                        coinList.map((token, i) => (
                          <option
                            className="Token-item"
                            key={i}
                            value={token.pubkey.toString()}
                          >
                            {token.pubkey.toString().slice(0, 5)}...
                            {token.pubkey
                              .toString()
                              .slice(token.pubkey.toString().length - 5)}
                          </option>
                        ))}
                    </select>
                    <div className="mt-2">
                    <span >Balance:</span>
                    <span className=""> {selectedToken?.balance.toString() ?? 'Select a token to see the balance'}</span>
                    </div>
                  </div>
                </div>
              ) :
               (
                // <TailSpin
                //   height="100"
                //   width="100"
                //   color="#00BFFF"
                //   // ariaLabel="loading"
                // />
                <div>No coin in wallet</div>
              )
              }

              {selectedToken && (
                <div className="Token-form w-full px-10">
                  <div className="flex flex-col mt-4">
                    <label htmlFor="deposit">Deposit amount</label>
                    <input
                        id="deposit"
                        type="number"
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="0"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col mt-4">
                    <label htmlFor="recievermint">Recieve Mint Address</label>
                    <input
                        id="recievermint"
                        onChange={(e) => setRecieverMint(e.target.value)} 
                        type="text" 
                        placeholder="0x00000000000000000000000000000000"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col mt-4">
                    <label htmlFor="recieve">Recieve amount</label>
                    <input
                        id="recieve"
                        type="number"
                        onChange={(e) =>
                          setExpectedAmount(Number(e.target.value))
                        }
                        placeholder="0"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <button className="Submit-form mt-4 border w-full h-12 rounded-md hover:bg-green-800 hover:border-none font-bold hover:text-black" onClick={onSubmit}>
                    Create Escrow
                  </button>
                </div>
              )}
            </div>
            {loading && <TailSpin
                  height="100"
                  width="100"
                  color="#00BFFF"
                  // ariaLabel="loading"
                 />}
            <p className="mt-6 text-center text-gray-500 dark:text-gray-400 sm:mt-8 px-4 lg:text-left">
              Financial transactions powered and processed by - Solana
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewEscrowForm;
