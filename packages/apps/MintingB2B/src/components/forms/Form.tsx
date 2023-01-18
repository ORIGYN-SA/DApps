import React from 'react';
import { Block } from './Block';


export const Form = ({ data }) => {

  return (
    <>
      <br />
      {data.map((obj) => {
        return (
          <>
            <Block {...obj} />
          </>
        );
      })}
    </>
  );
};

