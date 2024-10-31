import { useState, useCallback } from 'react'

const useImageLoader = () => {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isImageError, setIsImageError] = useState(false)

  const handleImageLoad = useCallback(() => setIsImageLoading(false), [])
  const handleImageError = useCallback(() => {
    setIsImageLoading(false)
    setIsImageError(true)
  }, [])

  return { isImageLoading, isImageError, handleImageLoad, handleImageError }
}

export default useImageLoader
