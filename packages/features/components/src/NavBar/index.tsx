import React from 'react';
import Navbar from '@origyn-sa/origyn-art-ui/build/components/interface/Navbar/Navbar';

const Navigation = ({ children }) => {

    console.log(Navbar)
  return (
    <>
      <Navbar>
        <div
          style={{
            flexGrow: '1',
            width: 'calc(100% - 320px)',
          }}
        >
          {children}
        </div>
        </Navbar>  
    </>
  );
};

export default Navigation;
