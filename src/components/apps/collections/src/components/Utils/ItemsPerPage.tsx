import React from 'react'

interface ItemsPerPageProps {
  itemsPerPage: number
  setItemsPerPage: (items: number) => void
  perPageOptions: number[]
}

const ItemsPerPage: React.FC<ItemsPerPageProps> = ({
  itemsPerPage,
  setItemsPerPage,
  perPageOptions,
}) => {
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value))
  }

  return (
    <div className='flex items-center'>
      <label className='mr-2 text-slate text-sm font-light'>Items per page</label>
      <select
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
        className='bg-[#F1F6F9] p-[5px_10px] font-semibold text-slate rounded-full focus:outline-none shadow-none '
      >
        {perPageOptions.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ItemsPerPage
