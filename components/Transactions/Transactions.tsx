"use client";
import { FaRegStickyNote } from "react-icons/fa";

const TransactionDashboardList = () => {
    const transactions: { id: number, amount: number, status: string, timestamp: Date, name: string }[] = [
        {
            id: 1,
            amount: 500,
            status: "success",
            timestamp: new Date(),
            name: "Samsung S21 Ultra" 
        },
        {
            id: 2,
            amount: 200,
            status: "failed",
            timestamp: new Date(),
            name: "Macbook Pro" 
        },
        {
            id: 3,
            amount: 300,
            status: "success",
            timestamp: new Date(),
            name: "Iphone 12 Pro" 
        },
        {
            id: 4,
            amount: 100,
            status: "pending",
            timestamp: new Date(),
            name: "Xiaomi Mi 11"
        }
    ]

    return (
        <div className="container w-screen px-10">
            <div className="flex justify-between items-center py-5">
                <p className="text-lg font-bold text-gray-900">Transactions</p>
                <p>See all</p>
            </div>
            {
                transactions.length < 1 &&
                <div className="flex items-center h-96 justify-center flex-col">
                    <FaRegStickyNote size={96} />
                    <p className="mt-10">No transactions yet. Start today!</p>
                </div>
            }

            {
                transactions.length > 0 &&
                <div className="flex flex-col gap-2">
                    {transactions.map(({ id, amount, status, timestamp, name }) => (
                        <div key={id} className="flex flex-row justify-between items-center w-full py-2 rounded-lg shadow-md">
                            <div className="flex flex-col items-start">
                                <p className="text-gray-900 font-semibold">{name}</p>
                                <p className="text-gray-500">{timestamp?.toDateString()}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className={`text-${status === "success" ? "green" : status === "failed" ? "red" : "yellow"}-700 font-semibold`}>{amount} sol</p>
                                <p className="text-gray-500">{status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default TransactionDashboardList