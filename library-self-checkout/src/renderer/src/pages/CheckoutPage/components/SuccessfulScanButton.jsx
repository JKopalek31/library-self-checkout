
import React from 'react';


const UserVerifiedButton = ({handleAddDummyDevice}) => {
  return (
    <button onClick={handleAddDummyDevice} className="bg-amber-500 rounded-md p-3 text-3xl text-center hover:bg-red-300">
      Correct
    </button>
  );
};

export default UserVerifiedButton;