import TransactionDashboardList from "@/components/Transactions/Transactions";

const EscrowPage = () => {
    return (
        <div className="flex flex-col container items-center min-h-screen">
            <div className="flex flex-col md:flex-row justify-between gap-12 w-full max-w-4xl">

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

            <div className="mt-10 md:mt-20 w-full max-w-xl">
                <button className="flex w-full items-center justify-center px-6 py-3 bg-white text-black rounded-md">
                    New transaction
                </button>
            </div>

            <div>
                <TransactionDashboardList />
            </div>
        </div>
    )
}

export default EscrowPage;