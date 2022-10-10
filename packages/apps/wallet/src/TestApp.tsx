import React from 'react';
import { readFileAsync } from '@origyn-sa/mintjs';
import { OrigynClient } from '@origyn-sa/mintjs';

export const TestApp = () => {
  const handleOnchange = async (e) => {
    const firstFile = e.target.files[0];
    const res = await readFileAsync(firstFile);
    console.log('🚀 ~ file: TestApp.tsx ~ line 8 ~ handleOnchange ~ res', res);
  };
  const handleButtonClick = async (e) => {
    OrigynClient.getInstance().init('rrkah-fqaaa-aaaaa-aaaaq-cai', {
      key: { seed: '' },
    });
    const { actor } = OrigynClient.getInstance();
    console.log('🚀 ~ file: TestApp.tsx ~ line 17 ~ handleButtonClick ~ actor', actor);
  };

  return (
    <>
      <div>TestApp</div>
      <button onClick={handleButtonClick}>get identity</button>
      <input type="file" onChange={handleOnchange} />
    </>
  );
};
