"use client";
import { 
    TOKEN_2022_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    getAccount,
    getAssociatedTokenAddressSync,
    // TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token"
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
import { AccountInfo, PublicKey, SystemProgram } from "@solana/web3.js"
import { FC, useEffect, useState } from "react"
import idl from "../../idl/anchor_escrow.json"
import { AnchorEscrow } from "../../idl/anchor_escrow"
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor"
import { randomBytes } from "crypto";
import { TailSpin } from "react-loader-spinner";
//import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


const seed = new BN(randomBytes(8))

const idl_string = JSON.stringify(idl)
const PROGRAM_ID = "2Xk3RLgedssCCiifAF7KYq8xt5dPW62jy5P8GZFGp3po"
const idl_object = JSON.parse(idl_string)




const NewEscrowForm = () => {

    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const anchorWallet = useAnchorWallet()
    const [coinList, setCoinList] = useState<{
        account: AccountInfo<Buffer>;
        pubkey: PublicKey;
    }[]>()
    const [selectedToken, setSelectedToken] = useState<{
        pubkey: PublicKey,
        balance: Number
    }>()
    const [amount, setAmount] = useState(0);
    const [recieverMint, setRecieverMint] = useState("")
    const [expectedAmount, setExpectedAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchAllTokens = async () => {
        if(publicKey) {
            const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
                programId: TOKEN_PROGRAM_ID
            })
            let tokenDetails = tokenAccounts.value.map(account => account)
            setCoinList(tokenDetails)
        }
    }
    useEffect(()=> {
        setLoading(true)
         fetchAllTokens()
       
        setLoading(false)
        console.log();
        
    }, [])

    console.log(selectedToken)
    //const isDisabled = coinList.length < 1 || amount < 1 || recieverMint.length < 1 || expectedAmount < 1 || description.length < 1 || loading ;
    
    const createEscrow = async () => {
        if(!anchorWallet || !selectedToken) {return alert("Wallet not connected");}
        try {
            setLoading(false)
            const provider = new AnchorProvider(connection, anchorWallet)
            const program = new Program<AnchorEscrow>(idl_object, provider)
            
            
            const mintA = (await getAccount(connection, selectedToken?.pubkey)).mint
            
            const [escrow, _bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("escrow"), anchorWallet.publicKey.toBuffer(), seed.toArrayLike(Buffer, "le", 8)],
                program.programId
            )
            const vault = getAssociatedTokenAddressSync(mintA, escrow, true, TOKEN_PROGRAM_ID)
            
            let depositDecimal =  (await connection.getTokenAccountBalance(selectedToken.pubkey)).value.decimals
            let receiveDecimal =  (await connection.getTokenSupply(new PublicKey(recieverMint))).value.decimals
            console.log(selectedToken.pubkey.toString())
            const tx = await program.methods.make(seed, new BN(amount*10**depositDecimal), new BN(expectedAmount*10**receiveDecimal))
            .accountsStrict({
                maker: anchorWallet.publicKey,
                makerAtaA: selectedToken?.pubkey,
                mintA,
                mintB: new PublicKey(recieverMint),
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                escrow,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                vault
              
            })
            
            .rpc()
            console.log(tx)
            alert("Tx Successful. Check console for Txid")
            setLoading(false)
        } catch(e) {
            alert("Something went wrong. Check console for error")
            console.log(e)
            console.log(selectedToken.pubkey.toString())
            setLoading(false)
        }
    }
        return (
                <div>
                        <section className="bg-white py-4 dark:bg-gray-900  rounded-md">
    <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">

            <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
           
                
                    {
                    
                    coinList  ?
                    
                        <div className="col-span-2">
                           
                            <div>
                                
                            <select name="Select token" defaultValue="--Select Token--" onChange={e => {
                                    (async() => {
                                        if(Number(e.target.value) === 0) {return}
                                        let balance = await connection.getTokenAccountBalance(new PublicKey(e.target.value))
                                        setSelectedToken({pubkey: new PublicKey(e.target.value), balance: Number(balance.value.amount)/10**balance.value.decimals})                                    
                                    })()
                                }}>
                                <option>--- Select Token ---</option>
                                {coinList.length && coinList.map((token, i) => (
                                        <option className="Token-item" key={i} value={token.pubkey.toString()}>
                                            {token.pubkey.toString().slice(0,5)}...{token.pubkey.toString().slice(token.pubkey.toString().length - 5)}
                                        </option>
                                    ))}
                            </select>
                            <span>Balance: {selectedToken?.balance.toString()}</span>
                            </div>
                           
                            

                            
                        </div>
                          : 
                          <TailSpin 
                          height="100"
                          width="100"
                          color="#00BFFF"
                         // ariaLabel="loading"
                          />
}

                        {
                            selectedToken && 
                            <div className="Token-form">
                            <div>
                                <label htmlFor="deposit">Deposit amount</label>
                                <input id="deposit" type="number" onChange={e => setAmount(Number(e.target.value))}/>
                            </div>
                            <div>
                                <label htmlFor="recievermint">Recieve Mint Address</label>
                                <input id="recievermint" type="text" onChange={e => setRecieverMint(e.target.value)}/>
                            </div>
                            <div>
                                <label htmlFor="recieve">Recieve amount</label>
                                <input id="recieve" type="number" onChange={e => setExpectedAmount(Number(e.target.value))}/>
                            </div>
                            <button className="Submit-form" onClick={createEscrow}>Create Escrow</button>
                        </div>
}


            </div>
            
            <p className="mt-6 text-center text-gray-500 dark:text-gray-400 sm:mt-8 px-4 lg:text-left">
                Financial transactions powered and processed by - Solana
            </p>
        </div>
    </div>
</section>
                </div>
        )
}


export default NewEscrowForm;