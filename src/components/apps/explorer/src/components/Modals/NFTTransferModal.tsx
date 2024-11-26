import React from 'react'
import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Principal } from '@dfinity/principal'
import { VerifiedIcon } from '@dapp/common-assets'
import { useFetchTransferFeeNft, useTransferNFT } from '@dapp/common-hooks'
import { NFT } from '@dapp/common-types'
import { Toast } from '@dapp/features-components'

interface NFTTransferModalProps {
  selectedNFT: NFT
  onClose: () => void
  canisterId: string
}

const NFTTransferModal: React.FC<NFTTransferModalProps> = ({
  selectedNFT,
  onClose,
  canisterId,
}) => {
  const [message, setMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [transferTo, setTransferTo] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchTransferFee = useFetchTransferFeeNft({
    nftId: selectedNFT.id,
    canister: canisterId,
  })

  const { mutate: transferNFT, isError, isSuccess, error, isPending } = useTransferNFT()
  const queryClient = useQueryClient()

  const handleTransferNFT = async () => {
    if (!transferTo) {
      setErrorMessage('Please enter a recipient address.')
      return
    }

    try {
      Principal.fromText(transferTo)
    } catch (error) {
      setErrorMessage('Invalid recipient address. Please enter a valid Principal ID.')
      return
    }

    transferNFT(
      {
        to: transferTo,
        nft: selectedNFT,
        fee: fetchTransferFee.data ?? 1,
        canisterId: canisterId,
      },
      {
        onSuccess: () => {
          setMessage('NFT successfully transferred')
          queryClient.invalidateQueries({ queryKey: ['getNFTActivity'] })
          queryClient.invalidateQueries({ queryKey: ['getUserNFTs'] })
          queryClient.invalidateQueries({ queryKey: ['getNFTDetails'] })
          setShowToast(true)
        },
        onError: (error: Error) => {
          console.error('Error during NFT transfer:', error)
          setMessage(error.message)
          setShowToast(true)
        },
      },
    )
  }

  const renderNFTDetails = useMemo(
    () => (
      <div className='w-full px-3 md:px-6 my-6'>
        <div className='flex px-3 py-2 items-center gap-4 border border-gray-300 rounded-2xl'>
          <img
            src={selectedNFT.image || 'https://placehold.co/243x244'}
            alt={selectedNFT.name || 'NFT Image'}
            className='h-28 w-28 rounded-2xl object-contain'
          />
          <div className='p-4'>
            <h3 className='text-[#69737C] font-medium text-[10px] leading-[18px] tracking-[2px] uppercase'>
              <span className='flex flex-row items-center gap-1'>
                {selectedNFT.categoryName || 'Unknown'} <VerifiedIcon />
              </span>
            </h3>
            <p className='text-[16px] font-bold leading-normal'>{selectedNFT.name || 'Unknown'}</p>
          </div>
        </div>
      </div>
    ),
    [selectedNFT],
  )

  const renderInputField = (
    label: string,
    value: string,
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    extraContent?: JSX.Element,
  ) => (
    <div className='flex flex-col items-start mt-4 w-full'>
      <label className='text-[#6F6D66] text-[13px] font-medium leading-normal mb-1'>{label}</label>
      <div className='relative w-full'>
        <input
          className='p-3 border rounded-full w-full'
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {extraContent && (
          <div className='absolute inset-y-0 right-0 flex items-center pr-2'>{extraContent}</div>
        )}
      </div>
    </div>
  )

  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-[#212425] bg-opacity-70 z-50'
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className='bg-white rounded-2xl px-4 md:px-0 py-8 w-[90%] md:w-1/2 xl:w-1/4 3xl:w-[20%] shadow-lg relative space-y-6 min-h-[400px]'>
        <button
          className='absolute top-4 right-4 text-gray-400 text-2xl hover:text-gray-600'
          onClick={onClose}
        >
          &times;
        </button>
        <div className='flex flex-col items-center justify-center w-full h-full'>
          {isPending ? (
            <div className='my-12 flex flex-col items-center justify-center w-full h-full'>
              <img
                src={'/assets/spinner.png'}
                alt='Loading spinner'
                className='w-12 h-12 animate-spin my-8'
              />
              <h2 className='text-[22px] font-semibold leading-normal'>Transferring your NFT</h2>
            </div>
          ) : isSuccess ? (
            <div className='flex flex-col items-center justify-center w-full h-full'>
              <img src='/assets/tick-circle.svg' alt='Tick circle' className='w-20 h-20 mb-6' />
              <h2 className='text-[22px] font-semibold leading-normal'>
                NFT successfully transferred
              </h2>
              {renderNFTDetails}
            </div>
          ) : isError ? (
            <div className='flex flex-col items-center justify-center w-full h-full px-6'>
              <h2 className='text-[20px] font-semibold text-red-700 mb-4'>
                Error transferring NFT
              </h2>
              <p className='text-red-600 text-[14px] font-medium'>
                {error?.message || 'An unexpected error occurred. Please try again.'}
              </p>
              <button
                className='mt-36 px-4 py-2  bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-all duration-150 ease-in-out'
                onClick={onClose}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className='text-[22px] font-semibold leading-normal'>Transfer NFT</h2>
              {renderNFTDetails}
              <div className='w-full px-3 md:px-6'>
                {renderInputField('Recipient Address', transferTo, 'Principal ID', e =>
                  setTransferTo(e.target.value),
                )}
              </div>
              {errorMessage && (
                <p className='text-red-500 text-sm italic my-4 px-3 md:px-6'>{errorMessage}</p>
              )}
              <button
                className={`bg-black px-5 py-4 mt-4 rounded-full hover:scale-105 duration-300 ease-in-out transition-all text-center text-white text-sm font-semibold`}
                onClick={handleTransferNFT}
                disabled={!transferTo}
              >
                Transfer NFT
              </button>
            </>
          )}
        </div>
      </div>
      {showToast && <Toast message={message} onClose={() => setShowToast(false)} />}
    </div>
  )
}

export default React.memo(NFTTransferModal)
