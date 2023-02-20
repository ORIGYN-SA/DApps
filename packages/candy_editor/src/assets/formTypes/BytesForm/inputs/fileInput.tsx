import React, { useState } from 'react';
import { Flex, TextInput, CheckboxInput, Button, Select } from '@origyn-sa/origyn-art-ui';
import { DropzoneArea } from 'mui-file-dropzone';
import { convertNat8ArrayToCandyBytes } from '../utils';
import { BytesFormInput, CandyBytes, ArrayType } from '../../../../types';

export const FileInput = (input: BytesFormInput) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyBytes>();
  const [arrayType, setArrayType] = useState<ArrayType>('thawed');
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [immutable, setImmutable] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
    setName(typedName.target.value);
  };

  const onTypeChanged = (selectedType: ArrayType) => {
    setArrayType(selectedType);
  };

  const onImmutableChanged = () => {
    setImmutable(!immutable);
  };

  const handleFileSelected = (files) => {
    setSelectedFile(files[0]);
  };

  const saveProperty = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onloadend = function () {
        const byteArray = new Uint8Array(reader.result as ArrayBuffer);
        console.log(byteArray);
        const nat8Array = Array.from(byteArray);
        const candyBytes = convertNat8ArrayToCandyBytes(nat8Array, arrayType);
        setValue(candyBytes);

        input.addPropertyToCandyClass({
          name: name,
          value: candyBytes,
          immutable: immutable,
          id: Math.random().toString(),
        });
      };
    }
  };

  return (
    <>
      <Flex>
        <TextInput label="Name" onChange={onNameChanged} />
      </Flex>
      <Flex>
        <Select
          inputSize="medium"
          label="Array Type"
          handleChange={(opt) => {
            onTypeChanged(opt.value);
          }}
          selectedOption={{ value: arrayType, label: arrayType }}
          options={[
            { value: 'thawed', label: 'thawed' },
            { value: 'frozen', label: 'frozen' },
          ]}
        />
      </Flex>
      <Flex>
        <DropzoneArea filesLimit={1} maxFileSize={16000} onChange={handleFileSelected} />
      </Flex>
      <Flex>
        <Flex>
          <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
        </Flex>
      </Flex>
      <Flex>
        <Button size="small" btnType="filled" onClick={saveProperty} disabled={isInvalid}>
          Save Property
        </Button>
      </Flex>
    </>
  );
};
