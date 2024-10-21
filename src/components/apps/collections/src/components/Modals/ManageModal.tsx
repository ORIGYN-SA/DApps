import React from 'react'

const ManageModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-[#212425] bg-opacity-70 z-50'
      onClick={onClose}
    >
      <div className='bg-white rounded-2xl py-8 w-[90%] md:w-1/2 xl:w-1/3 shadow-lg relative'>
        <button
          className='absolute top-4 right-4 text-gray-400 text-2xl hover:text-gray-600'
          onClick={onClose}
        >
          &times;
        </button>
        <div className='px-6 py-4'>
          <h2 className='text-2xl font-bold text-center mb-4'>Manage Token</h2>
          <p className='text-center text-gray-500 mb-6'>Manage your tokens and settings here.</p>
          {/* Content for managing tokens goes here */}
        </div>
      </div>
    </div>
  )
}

export default ManageModal
