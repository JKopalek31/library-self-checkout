import React from 'react'
import { Link } from 'react-router-dom'

const ToSummaryButton = () => {
  return (
    <Link to="/summary-page" className="bg-amber-500 rounded-md p-3 text-3xl text-center hover:bg-red-300">
    <button>
      Go to Summary
    </button>
    </Link>
  )
}

export default ToSummaryButton