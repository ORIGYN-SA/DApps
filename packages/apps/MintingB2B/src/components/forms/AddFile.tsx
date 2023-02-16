import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Card, Flex, Icons, Select } from '@origyn-sa/origyn-art-ui';
import { genRanHex } from '@dapp/utils';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';


const CustomFileUpload = styled.label`
  display: flex;
  flex-shrink: 0;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 148px;
  height: 148px;
  background: #5F5F5F;
  border-radius: 12px;
  cursor: pointer;
`

const CustomButton = styled.div`
  background-color: rgba(242, 242, 242, 0.4);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const AddFile = ({ handleAdd, pointer }) => {
  const [file, setFile] = useState<any>();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const [fileData] = e.target.files;
    console.log(fileData.set);
    setFile(fileData);
    addFile(fileData);
  };
  const handlePointerChange = (e) => {};

  const addFile = (fileData) => {
    const id = genRanHex(32);
    const { name } = fileData;
    const newFile = new File([fileData], id);
    const data = {
      fileName: name,
      pointer,
      type: fileData.type,
      preview: URL.createObjectURL(fileData),
      file: newFile,
      id,
    };
    handleAdd(data);
    setFile(undefined);
    fileInputRef.current.value = '';
  };

  return (
    <CustomFileUpload>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
      <CustomButton>
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18">
          <path d="M9.5 12.0001C9.2875 12.0001 9.1095 11.9281 8.966 11.7841C8.822 11.6406 8.75 11.4626 8.75 11.2501V5.8876L7.34375 7.29385C7.19375 7.44385 7.01875 7.51885 6.81875 7.51885C6.61875 7.51885 6.4375 7.4376 6.275 7.2751C6.125 7.1251 6.05325 6.94685 6.05975 6.74035C6.06575 6.53435 6.1375 6.3626 6.275 6.2251L8.975 3.5251C9.05 3.4501 9.13125 3.39685 9.21875 3.36535C9.30625 3.33435 9.4 3.31885 9.5 3.31885C9.6 3.31885 9.69375 3.33435 9.78125 3.36535C9.86875 3.39685 9.95 3.4501 10.025 3.5251L12.725 6.2251C12.875 6.3751 12.9467 6.5531 12.9403 6.7591C12.9342 6.9656 12.8625 7.1376 12.725 7.2751C12.575 7.4251 12.397 7.5031 12.191 7.5091C11.9845 7.5156 11.8062 7.44385 11.6562 7.29385L10.25 5.8876V11.2501C10.25 11.4626 10.1783 11.6406 10.0347 11.7841C9.89075 11.9281 9.7125 12.0001 9.5 12.0001ZM5 15.0001C4.5875 15.0001 4.2345 14.8533 3.941 14.5598C3.647 14.2658 3.5 13.9126 3.5 13.5001V12.0001C3.5 11.7876 3.57175 11.6093 3.71525 11.4653C3.85925 11.3218 4.0375 11.2501 4.25 11.2501C4.4625 11.2501 4.64075 11.3218 4.78475 11.4653C4.92825 11.6093 5 11.7876 5 12.0001V13.5001H14V12.0001C14 11.7876 14.072 11.6093 14.216 11.4653C14.3595 11.3218 14.5375 11.2501 14.75 11.2501C14.9625 11.2501 15.1405 11.3218 15.284 11.4653C15.428 11.6093 15.5 11.7876 15.5 12.0001V13.5001C15.5 13.9126 15.3533 14.2658 15.0597 14.5598C14.7657 14.8533 14.4125 15.0001 14 15.0001H5Z" fill="#FEFEFE"/>
        </svg>
      </CustomButton>
    </CustomFileUpload>
  );
};
