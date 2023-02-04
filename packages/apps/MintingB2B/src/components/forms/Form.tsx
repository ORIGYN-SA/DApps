import React from 'react';
import { Block } from './Block';


export const Form = ({ data, removeFile, addFile }) => {
  return (
    <>
      <br />
      {data?.map((obj) => {
        console.log("addFile1", addFile );
        return (
          <>
            <Block removeFile={removeFile} addFile={addFile} {...obj} />
          </>
        );
      })}
    </>
  );
};

