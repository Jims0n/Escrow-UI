

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
        <Link href="/finalize" className="w-fit px-10 p-4 bg-green-200 border-black text-white rounded-lg font-bold border">Incoming Transactions</Link>
        {/* <button className="w-full p-4 bg-primary-700 text-white rounded-lg font-bold border">Finalize</button> */}
      </div>

            <div className="flex flex-col md:flex-row justify-between px-6 md:px-0 gap-16 w-full max-w-4xl">

                <div className=" justify-center flex flex-col max-w-screen min-h-48 h-full w-full md:max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Balance</h5>
                    <span className="font-normal text-3xl md:text-5xl text-gray-700 dark:text-gray-400">500.000</span>
                    <span className="pl-3 font-normal text-gray-700 dark:text-gray-400">sol</span>
                </div>
               
                <div className="justify-center flex flex-col max-w-screen min-h-48 h-full w-full md:max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Transactions</h5>
                    <div className="flex flex-row justify-around items-start w-full text-left">
                        <div className="flex flex-col items-start flex-wrap justify-center ">
                            <p className="font-normal text-3xl text-gray-700">500</p>
                            <p className="font-normal text-gray-700 dark:text-gray-400">Total</p>
                        </div>

                        <div className="flex flex-col items-start flex-wrap justify-center ">
                            <p className="font-normal text-3xl text-green-700">300</p>
                            <p className="font-normal text-gray-700 dark:text-gray-400">Successful</p>
                        </div>

                        <div className="flex flex-col items-start flex-wrap justify-center">
                            <p className="font-normal text-3xl text-red-700">200</p>
                            <p className="font-normal text-gray-700 dark:text-gray-400">Failed</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-8 md:px-4 mb-10 md:mb-20 w-full justify-center flex gap-10 ">
        <Link href="/new" className="w-fit px-10 p-4 bg-black border-black text-white rounded-lg font-bold border">New Escrow Transactions</Link>
        
      </div>
        </div>

   </>
  );
}
