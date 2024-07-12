import NewEscrowForm from "./new"

const NewEscrowTransaction = () => {
    return (
        <div className="flex flex-col container items-center min-h-screen">
            <div className="flex flex-col items-center">
                <p className="font-bold text-lg">New Transaction</p>
                <p className="font-extralight">Be rest assured, your coins are protected</p>
            </div>
            <NewEscrowForm />
        </div>
    )
}

export default NewEscrowTransaction;