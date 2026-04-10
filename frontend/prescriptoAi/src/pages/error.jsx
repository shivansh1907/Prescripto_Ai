import React from 'react'



const ServerError = ({ message = "Something went wrong on our end." }) => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      
 
      <h1 className="text-6xl font-bold text-red-500">500</h1>

   
      <h2 className="text-2xl font-semibold mt-4">
        Internal Server Error
      </h2>

     
      <p className="text-gray-600 mt-2 max-w-md">
        {message}
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Retry
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg"
        >
          Go Home
        </button>
      </div>

    </div>
  );
};

export default ServerError;