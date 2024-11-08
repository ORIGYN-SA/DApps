export const formatWalletUpdatedDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')

  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12

  const formattedHours = String(hours).padStart(2, '0')

  return `${month}/${day}/${year} ${formattedHours}:${minutes} ${ampm}`
}
