import { useEffect, useState } from 'react';

export const useResponsiveTruncate = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const truncateAddress = (address: string) => {
    const length = address.length;

    let startLength;
    let endLength;

    if (windowWidth >= 1920) {
      // 4K screens and above
      startLength = 6;
      endLength = 6;
    } else if (windowWidth >= 1536) {
      // 2K to 4K screens
      startLength = 6;
      endLength = 4;
    } else if (windowWidth >= 1366) {
      // 1440p to 2K screens
      startLength = 4;
      endLength = 3;
    } else if (windowWidth >= 1280) {
      // 1280px to 1440p screens
      startLength = 10;
      endLength = 6;
    } else if (windowWidth >= 1024) {
      // 1024px to 1280px screens
      startLength = 12;
      endLength = 7;
    } else if (windowWidth >= 768) {
      // 768px to 1024px screens
      startLength = 6;
      endLength = 4;
    } else if (windowWidth >= 640) {
      // 640px to 768px screens
      startLength = 16;
      endLength = 9;
    } else if (windowWidth >= 480) {
      // 480px to 640px screens
      startLength = 18;
      endLength = 10;
    } else if (windowWidth >= 320) {
      // 320px to 480px screens
      startLength = 6;
      endLength = 7;
    }

    if (length <= startLength + endLength) return address;

    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  };

  return truncateAddress;
};
