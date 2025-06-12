
import React from 'react';
import { Link } from 'react-router-dom'


const StartButton = () => {
  return (
    // <button className="bg-amber-500 rounded-md p-3 text-xl hover:bg-red-300" >
    <Link to="/auth-page" className="bg-amber-500 rounded-md p-3 text-xl hover:bg-red-300">
    <button  >
      Get Started
    </button>
    </Link>
  );
};

export default StartButton;
