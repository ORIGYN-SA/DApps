import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { getPerpetualOSContext, URLContext } from '@origyn/perpetualos-context';

export const PerpetualOSContext = createContext(null as URLContext);

export const PerpetualOSContextProvider = ({ children }) => {
  const [context, setContext] = useState<URLContext>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const updateContext = async () => {
      try {
        const urlContext = await getPerpetualOSContext(window.location.href);
        setContext(urlContext);

        console.log('ContextProvider -> context', urlContext);
      } catch (err) {
        if (err instanceof Error) {
          throw new Error('Could not get Perpetual OS context: ' + err?.message ?? err.toString());
        }
      }
    };

    updateContext();
  }, [pathname]);

  // ensure that the context object is not null before rendering children
  return (
    <>
      {context && (
        <PerpetualOSContext.Provider value={context}>{children}</PerpetualOSContext.Provider>
      )}
    </>
  );
};

PerpetualOSContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
