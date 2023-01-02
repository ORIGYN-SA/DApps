import React from 'react';
import { HR } from '@origyn-sa/origyn-art-ui';
import { Block } from './Block';

export const Form = ({ data }) => {
  return (
    <>
      <br />
      {data.map((obj) => {
        return (
          <>
            {obj?.sectionHeader && (
              <>
                <br />
                <h6>{obj?.sectionHeader}</h6>
                <br />
                <HR></HR>
                <br />
              </>
            )}
            <Block {...obj} />
          </>
        );
      })}
    </>
  );
};
