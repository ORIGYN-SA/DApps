import { useState } from 'react';
import Toast from '../Utils/Toast';

export const CopyButton = ({ text }: { text: string }) => {
  const [showToast, setShowToast] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <>
      <img
        src="/assets/copy.svg"
        alt="Copy Icon"
        className="w-5 h-5 cursor-pointer hover:opacity-80"
        onClick={handleCopy}
      />
      {showToast && <Toast message="Copied to clipboard!" onClose={() => setShowToast(false)} />}
    </>
  );
};
