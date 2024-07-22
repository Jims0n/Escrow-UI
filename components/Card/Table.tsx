import React from 'react'

const Table = (props) => {
  return (
    <div className=' container mx-auto p-4'>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-gray-600 text-left text-sm uppercase font-medium">
                Escrow
              </th>
              <th className="py-2 px-4 bg-gray-200 text-gray-600 text-left text-sm uppercase font-medium">
                Offered Token
              </th>
              <th className="py-2 px-4 bg-gray-200 text-gray-600 text-left text-sm uppercase font-medium">
                Requested Token
              </th>
              <th className="py-2 px-4 bg-gray-200 text-gray-600 text-left text-sm uppercase font-medium">
                Requested Amount
              </th>
              <th className="py-2 px-4 bg-gray-200 text-gray-600 text-left text-sm uppercase font-medium">
                Deal
              </th>
            </tr>
          </thead>
          <tbody>
            {props.map((props.key) => (
              <tr key={props.key} className="border-t">
                <td className="py-2 px-4 text-gray-700"><a href={props.escrow}>{props.maker}</a></td>
                <td className="py-2 px-4 text-gray-700"><a href={`https://explorer.solana.com/address/${props.mintAUrl}?cluster=devnet`}>{props.mintA}</a></td>
                <td className="py-2 px-4 text-gray-700">{props.makerAmount}</td>
                <td className="py-2 px-4 text-gray-700"><a href={`https://explorer.solana.com/address/${props.mintBUrl}?cluster=devnet`}>{props.mintB}</a></td>
                <td className="py-2 px-4">
                {props.takerAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table