
import React from 'react';
import { Link } from 'react-router-dom'


const UserVerifiedButton = () => {
  return (
    <Link to="/checkout-page" className="bg-amber-500 rounded-md p-3 text-3xl text-center hover:bg-red-300">
    <button>
      This is me
    </button>
    </Link>
  );
};

export default UserVerifiedButton;
