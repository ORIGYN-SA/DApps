import React, { createContext, useContext, ReactNode } from 'react';

// enables JSON.stringify for objects with bigints
BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

interface DebugContextType {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
}

function isDebug(): boolean {
  const queryParams = new URLSearchParams(window.location.search);
  const debugParam = queryParams.get('debug');
  return debugParam === 'true';
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);


export const DebugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const debug = isDebug();
  const contextValue = {
    log: (...args: any[]) => {
      if (debug) {
        console.log(...args);
      }
    },
    error: (...args: any[]) => {
      if (debug) {
        console.error(...args);
      }
    },
    warn: (...args: any[]) => {
      if (debug) {
        console.warn(...args);
      }
    },
  };
  return <DebugContext.Provider value={contextValue}>{children}</DebugContext.Provider>;
};

export const useDebug = (): DebugContextType => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};
