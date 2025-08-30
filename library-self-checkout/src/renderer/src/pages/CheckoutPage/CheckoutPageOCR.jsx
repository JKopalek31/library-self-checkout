import { Link } from "react-router-dom"
import VideoOCR from '../../ocr/VideoOcr'

import ToSummaryButton from './components/ToSummaryButton'

const CheckoutPageOCR = () => {

    return (
        <div className="w-screen h-screen bg-offwhite p-6 text-2xl">
            <Link to="/auth-page" className="bg-red-400 px-4 py-2 rounded-md hover:bg-amber-200">Back </Link>
            <div className="grid grid-cols-2 mt-2 gap-10">
                <div className="grid grid-row-2 w-auto h-auto mx-auto gap-3">
                    <div className="p-6">
                        <div className="p-4 space-y-4">
                            <VideoOCR expectedMask="AAA-000" raiseCharFloor={65} beamWidth={5} />
                        </div>

                        {/* Optional fixed footer within the container */}
                        <div className="mt-7 w-200px m" >
                            <ToSummaryButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPageOCR