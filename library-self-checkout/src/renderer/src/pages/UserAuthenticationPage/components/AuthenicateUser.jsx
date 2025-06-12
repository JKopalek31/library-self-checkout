import React from 'react'
import UserVerifiedButton from './UserVerifiedButton'
import RetryButton from './RetryButton'
const AuthenicateUser = () => {
  return (
    <div className="mx-auto text-2xl bg-white p-8 mb-8 rounded-md">
        <div className="mb-20">
            <h1 className="text-6xl">Is this you?</h1>
            <ol className="mt-6 text-4xl">
                <li className="mb-6">Name: Jett Kopalek</li>
                <li className="mb-6">Student ID: 01010101</li>
            </ol>
        </div>
        <div className="grid grid-cols-2 gap-4 ">
            <UserVerifiedButton/>
            <RetryButton/>
        </div>



    </div>
  )
}

export default AuthenicateUser