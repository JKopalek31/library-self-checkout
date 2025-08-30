import React, { useState} from 'react';
import { Link } from 'react-router-dom'
import FaceCapture from './components/FaceCapture';
import AuthenicateUser from './components/AuthenicateUser';
import FacialRecognition from './components/FacialRecognition'


const UserAuthenicationPage = () => {
  const [recognizedName, setRecognizedName] = useState('');

  return (
    <div className="bg-offwhite h-screen w-screen p-6 text-2xl">
      <Link to="/" className="bg-red-400 px-4 py-2 rounded-md hover:bg-amber-200">Back </Link>
      <h1 className="mt-6 text-4xl font-semibold text-maroon">Please move your face into view for verification.</h1>
      <h1 className="text-lg text-maroon">Postion your face so that it is within the markers.</h1>
      <div className="flex justify-center mt-2">
        <div className="flex flex-row items-center space-y-4 space-x-12">
          <div className="">
            {/* <FaceCapture /> */}
            <FacialRecognition onRecognized={setRecognizedName} />

          </div>
          <div className="">
            <AuthenicateUser recognizedName={recognizedName} />
            {/* <FacialRecognition /> */}
          </div>
        </div>
      </div>


    </div>
  );
};

export default UserAuthenicationPage;
