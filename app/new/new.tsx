"use client";

import { useState } from "react";

const NewEscrowForm = () => {

    const [coinList, setCoinList] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState("");
    const [amount, setAmount] = useState("");
    const [receiverAddress, setReceiverAddress] = useState("");

    

        return (
                <div>
                        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
    <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">

            <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
                <form action="#" className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8">
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="coin-list" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Coin list </label>
                            <select id="coin-list" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" required>
                                <option value="BTC">BTC</option>
                                <option value="ETH">ETH</option>
                                <option value="SOL">SOL</option>
                            </select>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="card-number-input" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Amount* </label>
                            <input type="text" id="card-number-input" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="xxxxxxx" required />
                        </div>

                    </div>

                    <button type="submit" className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Generate link </button>
                </form>

            </div>

            <p className="mt-6 text-center text-gray-500 dark:text-gray-400 sm:mt-8 px-4 lg:text-left">
                Financial transactions processed by - Solana
            </p>
        </div>
    </div>
</section>
                </div>
        )
}


export default NewEscrowForm;