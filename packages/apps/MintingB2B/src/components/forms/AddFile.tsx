import React, { useRef, useState } from 'react';
import { Button, Card, Flex, Icons, Select } from '@origyn-sa/origyn-art-ui';
import { genRanHex } from '@dapp/utils';

export const AddFile = ({ handleAdd, pointer }) => {
  const [fileType, setFileType] = useState<any>({ value: 'image/*', label: 'Image' });
  const [file, setFile] = useState<any>();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const [fileData] = e.target.files;
    console.log(fileData.set);
    setFile(fileData);
  };
  const handlePointerChange = (e) => {};

  const addFile = () => {
    const id = genRanHex(32);
    const { name } = file;
    const newFile = new File([file], id);
    const data = {
      fileName: name,
      pointer,
      type: file.type,
      preview: URL.createObjectURL(file),
      file: newFile,
      id,
    };
    handleAdd(data);
    setFile(undefined);
    fileInputRef.current.value = '';
  };

  return (
    <Card padding="8px" align="center" gap={16} justify="space-between">
      <div>
        <p>Media Type</p>
        <p>
          <Select
            options={[
              { value: 'image/*', label: 'Image' },
              { value: 'video/*', label: 'Video' },
              // { value: 'video/youtube', label: 'YouTube' },
              // { value: 'video/vimeo', label: 'Vimeo' },
            ]}
            selectedOption={fileType}
            handleChange={setFileType}
          />
        </p>
      </div>
      <div>
        <p>Select File</p>
        <p>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} />
        </p>
      </div>
      {/*<div>*/}
      {/*  <p>Specify Pointer</p>*/}
      {/*  <p><TextInput type='text' onChange={handlePointerChange} /></p>*/}
      {/*</div>*/}
      <div>
        <p></p>
        <Flex>
          <Button type="button" onClick={addFile} iconButton>
            <Icons.CheckIcon width="16" height="16" />
          </Button>
        </Flex>
      </div>
    </Card>
  );
};
