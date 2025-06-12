import React from 'react';
import { Link } from 'react-router-dom'
import FaceCapture from './components/FaceCapture';
import AuthenicateUser from './components/AuthenicateUser';

const UserAuthenicationPage = () => {
  return (
    <div className="bg-red-200 h-screen w-screen p-6 text-2xl">
      <Link to="/" className="bg-red-400 px-4 py-2 rounded-md hover:bg-amber-200">Back </Link>
      <h1 className="mt-8 text-4xl font-semibold">Please move your face into view for verification.</h1>
      <h1>Postion your face so that it is within the markers.</h1>
      <div className="flex justify-center mt-2">
        <div className="flex flex-row items-center space-y-4 space-x-12">
          <div className="">
            <FaceCapture />
          </div>
          <div className="">
            <AuthenicateUser />
          </div>
        </div>
      </div>


    </div>
  );
};

export default UserAuthenicationPage;
