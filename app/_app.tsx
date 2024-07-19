"use client";

import Navbar from "@/components/Navbar/Navbar";
import { ContextProvider } from "@/contexts/ContextProvider";
import Head from "next/head";
import {web3} from "@coral-xyz/anchor"
require('@solana/wallet-adapter-react-ui/styles.css');


const App = ({ children }: {children: React.ReactNode }) => {
    
    return (
        <>
            <Head>
                <title>Deposito</title>
            </Head>

            <ContextProvider>
                <div className="flex flex-col h-screen">
                   
                    <Navbar />
                   
                    {children}
                   
                </div>
            </ContextProvider>
        </>
    );
}

export default App