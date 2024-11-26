import React from 'react'

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className='flex items-center justify-center px-6 py-4 text-red-700 rounded-2xl'>
    <p>An error occurred while fetching NFT details: {message}</p>
  </div>
)

export default ErrorMessage
