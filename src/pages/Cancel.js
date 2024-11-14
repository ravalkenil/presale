// Cancel.js
import React from 'react';

const Cancel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <h1 className="text-3xl font-bold text-red-800">Payment Cancelled</h1>
      <p className="mt-4 text-lg text-gray-700">Your payment has been cancelled. If you have any questions, please contact support.</p>
      <a href="/" className="mt-6 text-blue-500 hover:underline">
        Go to Home
      </a>
    </div>
  );
};

export default Cancel;
