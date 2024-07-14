"use client";

import { useState } from "react";

const NewEscrowForm = () => {

    const [coinList, setCoinList] = useState([]);
    const [selectedToken, setSelectedToken] = useState("");
    const [amount, setAmount] = useState(0);
    const [receiverAddress, setReceiverAddress] = useState("");
    const [expectedAmount, setExpectedAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    console.log(selectedToken)
    const isDisabled = coinList.length < 1 || amount < 1 || receiverAddress.length < 1 || expectedAmount < 1 || description.length < 1 || loading ;
    

        return (
                <div>
                        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
    <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">

            <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
                <form action="#" className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8">
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label htmlFor="coin-list" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Token list </label>
                            <select value={selectedToken} onChange={e => setSelectedToken(e.target.value)} id="coin-list" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" required>
                                <option>--- Select Token ---</option>
                                <option value="BTC">BTC</option>
                                <option value="ETH">ETH</option>
                                <option value="SOL">SOL</option>
                            </select>

                            {selectedToken && selectedToken !== '--- Select Token ---' && 
                                <>
                                    <span className="font-light text-gray-200 text-sm">Balance:</span>
                                    <span className="text-green-800 font-bold"> 40</span>
                                </>
                            }
                        </div>

                        {
                            selectedToken && selectedToken !== '--- Select Token ---' && 
                            <>
                            <div className="col-span-2">
                                <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Amount* </label>
                                <input value={amount} onChange={e => setAmount(Number(e.target.value))} type="number" id="amount" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="xxxxxxx" required />
                            </div>

                        <div className="col-span-2">
                            <label htmlFor="receiver-address" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Receiver Address* </label>
                            <input value={receiverAddress} onChange={e => setReceiverAddress(e.target.value)} type="text" id="receiver-address" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="xxxxxxx" required />
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="expected-amount" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Expected Amount* </label>
                            <input value={expectedAmount} onChange={e => setExpectedAmount(Number(e.target.value))} type="number" id="expected-amount" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="xxxxxxx" required />
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Description* </label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} id="description" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="xxxxxxx" required />
                        </div>
                        </>
                        }
                    </div>

                    <button type="submit" disabled={isDisabled} 
                        className="border flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            Create Escrow
                    </button>
                </form>

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