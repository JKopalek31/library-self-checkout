import React, { useState} from 'react'
import { Link } from "react-router-dom"

import IndivisualMediaDevice from './components/IndivisualMediaDevice'
import SuccessFullScanButton from './components/SuccessfulScanButton'
import RetryScanMediaButton from './components/RetryScanMediaButton'
import ToSummaryButton from './components/ToSummaryButton'

const CheckoutPage = () => {
    const [scannedDevices, setScannedDevices] = useState([]);

    const handleAddDummyDevice = () => {
        // You can replace this with actual device info later
        const dummy = {
        title: 'Example Book',
        author: 'Jane Doe',
        isbn: '123-456-789'
        };
        setScannedDevices(prev => [...prev, dummy]);
    };
  return (
    <div className="w-screen h-screen bg-amber-400 p-6 text-2xl">
        <Link to="/auth-page" className="bg-red-400 px-4 py-2 rounded-md hover:bg-amber-200">Back </Link>
        <div className="grid grid-cols-2 mt-2 gap-10">
            <div className="grid grid-row-2 w-auto h-auto mx-auto gap-3">
                <div className="bg-blue-400 p-4 rounded-md text-3xl mt-2">
                    <h1>Please scan your media devices and click submit once all media devices have been entered.</h1>
                </div> 
                <div className="bg-red-500 p-3 text-center text-3xl rounded-md">
                    <h1>Selected Media Device</h1>
                    <div className="w-full h-1 bg-white rounded-full mb-4 mt-2"/>
                    <div className="h-42 bg-orange-100 rounded-md">
                        <IndivisualMediaDevice/>
                    </div>
                    <div className="mb-1">
                        <h1 className="m-2">Is this media correct?</h1>
                        <div className="grid grid-cols-2 gap-4">
                           < SuccessFullScanButton handleAddDummyDevice={handleAddDummyDevice}/>
                            <RetryScanMediaButton />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* <div className="bg-orange-200 w-full h-full mx-auto rounded-md">

            </div> */}
            {/* <div className="bg-orange-200 w-full h-full mx-auto rounded-md p-4 overflow-auto">
                <h2 className="text-3xl font-bold text-center">Checkout Cart</h2>
                <div className="w-full h-1 rounded-full bg-red-300 mt-2 mb-4"/>
                {scannedDevices.map((device, idx) => (
                    <div key={idx} className="mb-4 p-3 bg-white rounded shadow">
                        <p><strong>Title:</strong> {device.title}</p>
                        <p><strong>Author:</strong> {device.author}</p>
                        <p><strong>ISBN:</strong> {device.isbn}</p>
                    </div>
                ))}
            </div> */}
            <div className="bg-orange-200 w-full max-h-[100vh] mx-auto rounded-md p-4">
                <h2 className="text-3xl font-bold text-center">Checkout Cart</h2>
                <div className="w-full h-1 rounded-full bg-red-300 mt-2 mb-4" />
                
                <div className="overflow-auto h-[400px] pb-16 relative">
                    {scannedDevices.map((device, idx) => (
                    <div key={idx} className="mb-4 p-3 bg-white rounded shadow">
                        <p><strong>Title:</strong> {device.title}</p>
                        <p><strong>Author:</strong> {device.author}</p>
                        <p><strong>ISBN:</strong> {device.isbn}</p>
                    </div>
                    ))}
                </div>

            {/* Optional fixed footer within the container */}
                <div className="mt-7 w-200px mx-16" >
                    <ToSummaryButton/>
                </div>
            </div>
            {/* <div className="h-20 w-auto bg-red-600"></div> */}


        </div>




    </div>
  )
}

export default CheckoutPage