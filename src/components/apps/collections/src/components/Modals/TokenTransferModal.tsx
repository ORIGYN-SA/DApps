import { useState, useRef, useEffect } from 'react'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { Principal } from '@dfinity/principal'
import { Currency, currencies } from '@dapp/common-constants'
import { useTokensTransfer } from '@dapp/common-hooks'
import { CopyButton } from '@dapp/features-components'
import { useTokenData } from '@dapp/features-tokensdata'
import { useUserProfile } from '@dapp/features-userprofile'
import { useResponsiveTruncate, getUserBalance } from '@dapp/utils'

const TokenTransferModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currency, setCurrency] = useState<Currency>(currencies[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [transferPrice, setTransferPrice] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const truncateAddress = useResponsiveTruncate()
  const { getUSDPrice, getLogo } = useTokenData()
  const { userProfile } = useUserProfile()
  const { mutate: transferTokens, status, isSuccess, isError } = useTokensTransfer()
  const queryClient = useQueryClient()

  const onTransferClick = () => {
    if (!transferTo || !transferPrice) {
      setErrorMessage("Please enter the recipient's address and amount.")
      return
    }

    try {
      Principal.fromText(transferTo)
    } catch (error) {
      setErrorMessage('Invalid recipient address. Please enter a valid Principal ID.')
      return
    }

    const amount = BigInt(parseFloat(transferPrice) * 10 ** currency.decimals)
    setErrorMessage(null)
    transferTokens(
      { to: transferTo, amount, currency: currency.code },
      {
        onError: (error: Error) => {
          setErrorMessage(error.message)
        },
        onSuccess: () => {
          setErrorMessage(null)
          queryClient.invalidateQueries({ queryKey: ['getUserNFTs'] })
          queryClient.invalidateQueries({ queryKey: ['getNFTDetails'] })
        },
      },
    )
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCurrencySelect = (selectedCurrency: Currency) => {
    setCurrency(selectedCurrency)
    setIsDropdownOpen(false)
  }

  const filteredCurrencies = currencies.filter(curr => curr.code !== currency.code && curr.isUsable)
  const convertedPrice = transferPrice
    ? (parseFloat(transferPrice) * (getUSDPrice(currency.code) || 0)).toFixed(2)
    : '0.00'

  const renderInputField = (
    label: string,
    value: string,
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    extraContent?: JSX.Element,
  ) => (
    <div className='flex flex-col items-start mt-2 w-full'>
      <label className='text-[#6F6D66] text-[13px] font-medium leading-normal mb-1'>{label}</label>
      <div className='relative w-full'>
        <input
          type={label === 'Amount' ? 'number' : 'text'}
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

  const renderCurrencyDropdown = (
    <div className='relative w-full' ref={dropdownRef}>
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`bg-[#f9fafe] text-[#212425] text-[12px] font-medium uppercase tracking-widest cursor-pointer flex justify-between items-center p-2 w-32 ${
          isDropdownOpen ? 'border-x border-t rounded-t-2xl' : 'border rounded-full'
        } border-gray-300`}
        style={{
          backgroundImage: `url(${currency.icon})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left 10px center',
          backgroundSize: '20px',
          paddingLeft: '2.5rem',
        }}
      >
        {currency.code}
        <span
          className={`transform font-semibold text-lg transition-transform ${
            isDropdownOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='w-5 h-5'
          >
            <path
              fillRule='evenodd'
              d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z'
              clipRule='evenodd'
            />
          </svg>
        </span>
      </div>

      {isDropdownOpen && (
        <div className='absolute z-10 w-32 bg-white border-x border-b rounded-b-2xl border-gray-300 shadow-lg'>
          {filteredCurrencies.map(curr => (
            <button
              key={curr.code}
              className='flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 rounded-b-2xl focus:outline-none'
              onClick={() => handleCurrencySelect(curr)}
            >
              <img src={curr.icon} alt={curr.code} className='h-5 w-5 mr-2' />
              {curr.code}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const renderProcessingView = (
    <div className='my-12 flex flex-col items-center justify-center w-full h-full'>
      <img
        src='/assets/spinner.png'
        alt='Loading spinner'
        className='w-12 h-12 animate-spin my-8'
      />
      <h2 className='text-[22px] font-semibold leading-normal'>Processing</h2>
    </div>
  )

  const renderSuccessView = (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      <img src='/assets/tick-circle.svg' alt='Tick circle' className='w-20 h-20 my-6' />
      <h2 className='text-[22px] font-semibold leading-normal flex flex-row items-center gap-2'>
        You sent {transferPrice} {currency.code}{' '}
        <img src={getLogo(currency.code)} alt={currency.code} className='w-6 h-6' />
      </h2>
      <div className='pl-1 pr-4 py-1 my-4 bg-[#f9fafe] rounded-[100px] border border-[#e9eaf1] justify-between items-center inline-flex w-3/4'>
        <img src='/assets/profile_icon.svg' alt='Profile Icon' className='w-10 h-10' />
        <div className='flex flex-col xl:flex-row justify-center items-center w-3/4 md:w-[60%]'>
          <span className='text-[#212425] text-sm'>to:</span>
          <span className='text-[#212425] text-sm font-semibold pl-2'>
            {truncateAddress(transferTo)}
          </span>
        </div>
        <CopyButton text={transferTo} />
      </div>
      <button
        className='bg-black px-5 py-4 w-3/4 rounded-full hover:scale-105 duration-300 ease-in-out transition-all text-center text-white text-sm font-semibold'
        onClick={onClose}
      >
        Back to profile
      </button>
    </div>
  )

  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-[#212425] bg-opacity-70 z-50'
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className='bg-white rounded-2xl flex flex-col items-center justify-center w-[90%] md:w-1/2 xl:w-1/3 2xl:w-1/4 3xl:w-1/5 shadow-lg relative min-h-[400px]'>
        <button className='absolute top-6 right-5' onClick={onClose}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z'
              fill='#69737C'
            />
          </svg>
        </button>

        {status === 'pending' ? (
          renderProcessingView
        ) : isSuccess ? (
          renderSuccessView
        ) : (
          <>
            <div className='mt-6'>
              <h2 className='text-center text-[#212425] text-[22px] font-semibold mt-6'>
                Transfer Token
              </h2>
              <p className='text-sm mb-4 text-slate text-[13px] font-medium leading-normal text-center'>
                Transfer your tokens to another wallet.
              </p>
            </div>

            <div className='w-full px-3 md:px-6'>
              {renderInputField('Recipient Address', transferTo, 'Principal ID', e =>
                setTransferTo(e.target.value),
              )}
              {renderInputField(
                'Amount',
                transferPrice,
                'Enter amount',
                e => {
                  const value = e.target.value
                  if (!isNaN(parseFloat(value)) || value === '') {
                    setTransferPrice(value)
                  }
                },
                renderCurrencyDropdown,
              )}
              <p className='text-sm mb-4 text-slate text-[13px] font-medium leading-normal italic ml-auto pr-7'>
                ${convertedPrice} USD
              </p>
              {isError ||
                (errorMessage && (
                  <p className='text-red-500 text-sm italic my-4'>{errorMessage}</p>
                ))}
              <button
                className={`bg-[#212425] rounded-full w-full py-3 text-center text-white text-sm font-semibold transition-opacity duration-300 ${
                  !transferTo || !transferPrice ? 'opacity-80 cursor-not-allowed' : ''
                }`}
                onClick={onTransferClick}
                disabled={!transferTo || !transferPrice}
              >
                Transfer
              </button>
            </div>
            <div className='flex flex-col items-center justify-center min-h-12 mt-8 border-t border-slate w-full rounded-b-2xl bg-[#f9fafe]'>
              <p className='text-[#69737c] text-[13px] font-normal leading-none'>
                Current balance:{' '}
                <span className='font-bold'>
                  {getUserBalance(userProfile, currency.code)} {currency.code}
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TokenTransferModal
