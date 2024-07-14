import Link from "next/link";

const FinalizeContract = () => {
    const txn = [
        {
            offeredToken: "40",
            offeredAmount: "100",
            requestedToken: "20",
            requestedAmount: "50",
            escrowLink: "http://localhost:3000/escrow/1",
            id: "1"
        },

        {
            offeredToken: "40",
            offeredAmount: "100",
            requestedToken: "20",
            requestedAmount: "50",
            escrowLink: "http://localhost:3000/escrow/1",
            id: "2"
        }
    ]

    return (
        <div className="w-full max-w-5xl">
            {txn.map(tx => (
                <div className="block w-full p-6 bg-white border my-4 border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <div>
                        <span className="mb-2 text-2xl font-light tracking-tight text-gray-900 dark:text-white">Escrow: </span>
                        <Link href="" className="mb-2 text-2xl font-bold tracking-tight text-blue-400 underline">xuew</Link>
                    </div>
                    <div>
                        <p className="font-normal text-gray-700 dark:text-gray-400">Offered token: { tx.offeredToken } </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400">Offered amount: { tx.offeredAmount } </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400">Requested token: { tx.requestedToken } </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400">Requested amount: { tx.requestedAmount } </p>
                    </div>
                    <div className="flex gap-10 mt-4">
                        <button className="w-full p-2 bg-primary-700 text-white rounded-lg font-bold border">Reject and Refund</button>
                        <button className="w-full p-2 bg-primary-700 text-white rounded-lg font-bold border">Agree to terms</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FinalizeContract;