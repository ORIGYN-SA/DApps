import { useState, useRef, useEffect } from 'react'
import { Currency, currencies } from '../../constants/currencies'
import { NFT } from '../../types/global'
import { useTokenData } from '../../context/TokenDataContext'
import { useUserProfile } from '../../context/UserProfileContext'
import { Token } from '../../types/token'
import { SaleToken, useSellNFT } from '../../hooks/useSellNFT'
import VerifiedIcon from '../../assets/icons/VerifiedIcon'

interface OpenASaleModalProps {
  selectedNFT: NFT
  onClose: () => void
}

const OpenASaleModal: React.FC<OpenASaleModalProps> = ({ selectedNFT, onClose }) => {
  const { getUSDPrice, getTokenData } = useTokenData()
  const [currency, setCurrency] = useState<Currency>(currencies[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [salePrice, setSalePrice] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { mutate: sellNFT, isError, isSuccess, error, isPending } = useSellNFT()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCurrencySelect = (selectedCurrency: Currency) => {
    setCurrency(selectedCurrency)
    setIsDropdownOpen(false)
  }

  const handleListNFT = () => {
    const tokenData = getTokenData(currency.code)
    if (!tokenData) {
      console.error('Get Token data Error:', currency.code)
      return
    }
    const token: SaleToken = {
      feesUSD: tokenData.feesUSD,
      priceUSD: tokenData.priceUSD,
      decimals: currency.decimals,
      canister: currency.canisterId,
      standard: tokenData.standard as 'Ledger',
      symbol: tokenData.symbol,
      id: tokenData.id,
    }

    sellNFT({
      nftId: selectedNFT.id,
      collectionId: selectedNFT.collectionName,
      price: BigInt(salePrice),
      token,
    })
  }

  const isSaleSuccess = (data: any) => {
    return data && 'ok' in data && !('err' in data)
  }

  const filteredCurrencies = currencies.filter(curr => curr.code !== currency.code)
  const convertedPrice = salePrice
    ? (parseFloat(salePrice) * (getUSDPrice(currency.code) || 0)).toFixed(2)
    : '0.00'

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const renderNFTDetails = () => (
    <div className='w-full px-3 md:px-6 my-6'>
      <div className='flex px-3 py-2 items-center gap-4 border border-gray-300 rounded-2xl'>
        <img
          src={selectedNFT.image || 'https://via.placeholder.com/243x244'}
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
  )

  const renderPriceInput = () => (
    <div className='flex flex-col items-start mt-4 w-full px-3 md:px-6'>
      <label className='text-[#6F6D66]  text-[13px] font-medium leading-normal mb-1'>
        Set your price
      </label>
      <div className='relative w-full'>
        <input
          placeholder='Enter price'
          className='p-3 border rounded-full w-full pr-28'
          onChange={e => setSalePrice(e.target.value)}
          value={salePrice}
        />
        <div className='absolute inset-y-0 right-0 flex items-center pr-2' ref={dropdownRef}>
          <div className='relative w-full'>
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
                    type='button'
                    className='flex items-center w-full px-[12px] py-2 text-sm text-left hover:bg-gray-100 rounded-b-2xl focus:outline-none'
                    onClick={() => handleCurrencySelect(curr)}
                  >
                    <img src={curr.icon} alt={curr.code} className='h-5 w-5 mr-2' />
                    {curr.code}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className='text-sm mb-4 text-slate text-[13px] font-medium leading-normal italic ml-auto pr-7'>
        ${convertedPrice} USD
      </p>
    </div>
  )

  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-[#212425] bg-opacity-70 z-50'
      onClick={handleOutsideClick}
    >
      <div className='bg-white rounded-2xl px-4 md:px-0 py-8 w-[90%] md:w-1/2 xl:w-1/4 3xl:w-1/4 shadow-lg relative space-y-6 min-h-[400px]'>
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
              <h2 className='text-[22px] font-semibold leading-normal'>Listing your NFT</h2>
            </div>
          ) : isSuccess ? (
            <div className='flex flex-col items-center justify-center w-full h-full'>
              <img src='/assets/tick-circle.svg' alt='Tick circle' className='w-20 h-20 mb-6' />
              <h2 className='text-[22px] font-semibold leading-normal'>NFT successfully listed</h2>
              {renderNFTDetails()}
              <a
                className='bg-black px-5 py-4 w-1/2 rounded-full hover:scale-105 duration-300 ease-in-out transition-all text-center text-white text-sm font-semibold'
                href=''
                target='_blank'
                rel='noreferrer'
                onClick={onClose}
              >
                See certificate
              </a>
            </div>
          ) : isError ? (
            <div className='flex flex-col items-center justify-center w-full h-full'>
              <h2 className='text-[22px] font-semibold leading-normal text-red-600'>
                Error listing NFT
              </h2>
              <p className='text-red-600'>{error?.message}</p>
            </div>
          ) : (
            <>
              <h2 className='text-[22px] font-semibold leading-normal'>Open a sale</h2>
              {renderNFTDetails()}
              {renderPriceInput()}
              <button
                className={`bg-black mt-4 px-5 py-4 rounded-full hover:scale-105 duration-300 ease-in-out transition-all text-center text-white text-sm font-semibold ${
                  salePrice ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
                onClick={salePrice ? handleListNFT : undefined}
                disabled={!salePrice}
              >
                List for {salePrice || '0'} {currency.code}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default OpenASaleModal
