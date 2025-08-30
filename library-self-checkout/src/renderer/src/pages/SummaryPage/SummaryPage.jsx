import React from 'react'
import { Link } from 'react-router-dom'


const SummaryPage = () => {
  return (

    <div className="w-screen h-screen bg-pink-200 p-6 text-2xl">
        <Link to="/checkout-page" className="bg-red-400 px-4 py-2 rounded-md hover:bg-amber-200">Back </Link>
        <div className="text-6xl font-semibold text-center">
            <h1>Checkout Summary</h1>
        </div>
        <div className="grid grid-cols-2 h-3/4 bg-teal-200">
            <div className="bg-red-400">
              <h1>Here is where the summary goes somehow</h1>
            </div>
            <div className="bg-slate-400">
              <h1>Here is where there will be some kind of list for checkout items</h1>

            </div>

        </div>
        <div className="bg-red-200 h-20 px-96 py-5">
        <Link to="/" className="bg-amber-200 px-4 py-2 rounded-md hover:bg-red-400 text-3xl">Submit </Link>
            
        </div>

    </div>
  )
}

export default SummaryPage







