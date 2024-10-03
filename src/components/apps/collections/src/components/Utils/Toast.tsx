import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number; // Durée avant la fermeture automatique (en millisecondes)
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Temps de fermeture pour l'animation
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 h-12 pl-8 bg-[#212425] text-white text-sm rounded shadow flex items-center transition-transform duration-300 ease-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full opacity-0'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
        willChange: 'transform, opacity', // Optimise les performances pour l'animation
      }}
    >
      <p>{message}</p>
      <button className="w-12 h-12 text-white ml-auto text-4xl ml-8 " onClick={() => setIsVisible(false)}>
        &times;
      </button>
    </div>
  );
};

export default Toast;
