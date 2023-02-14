import React, { useState, useEffect } from 'react';
import { Flex, TextInput, CheckboxInput, Button, Grid } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyFloat } from '../../../types';
import { DropzoneArea } from 'mui-file-dropzone';
import { VALIDATION_ERRORS, CREATE_MODE, EDIT_MODE } from '../../../constants';

export const BytesForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyFloat>();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [formValue, setFormValue] = useState<string>('');
  const [immutable, setImmutable] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>(null);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
    setName(typedName.target.value);
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty(
        { name: typedName.target.value, value, immutable },
        editor.propertyIndex,
      );
    }
  };

  const onImmutableChanged = () => {
    setImmutable(!immutable);
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty({ name, value, immutable: !immutable }, editor.propertyIndex);
    }
  };

  const handleFileSelected = (files) => {
    setSelectedFile(files[0]);
  };

  const saveProperty = () => {
    editor.addPropertyToCandyClass({
      name: name,
      value: value,
      immutable: immutable,
      id: Math.random().toString(),
    });

    handleSubmit();
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onloadend = function () {
        const byteArray = new Uint8Array(reader.result as ArrayBuffer);
        console.log(byteArray);
      };
    }
  };

  useEffect(() => {
    if (editor.editorMode === EDIT_MODE) {
      const candyValue = editor.property.value as CandyFloat;
      setName(editor.property.name);
      setValue(candyValue);
      setImmutable(editor.property.immutable);
      setFormValue(candyValue.Float.valueOf().toString());
    }
  }, [editor.editorMode]);

  return (
    <>
      {editor.editorMode === CREATE_MODE ? (
        <>
          <Flex>
            <TextInput label="Name" onChange={onNameChanged} />
          </Flex>
          <Flex>
            <DropzoneArea filesLimit={1} maxFileSize={2147483648} onChange={handleFileSelected} />
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
      ) : (
        <></>
      )}
    </>
  );
};
