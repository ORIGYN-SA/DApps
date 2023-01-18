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

export const AddFile = ({ handleAdd, pointer }) => {
  const [fileType, setFileType] = useState<any>({ value: 'image/*', label: 'Image' });
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
      <PlayForWorkIcon fontSize="large" />
    </CustomFileUpload>
  );
};
