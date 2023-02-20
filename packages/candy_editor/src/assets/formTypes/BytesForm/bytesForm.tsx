import React, { useState, useEffect } from 'react';
import {
  Flex,
  TextInput,
  CheckboxInput,
  Grid,
  Select,
  TabContent,
  Container,
} from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyBytes, ArrayType } from '../../../types';
import { convertNat8ArrayToCandyBytes } from './utils';
import { VALIDATION_ERRORS, CREATE_MODE, EDIT_MODE } from '../../../constants';
import { FileInput } from './inputs/fileInput';

export const BytesForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyBytes>();
  const [arrayType, setArrayType] = useState<ArrayType>('thawed');
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

  const onTypeChanged = (selectedType: ArrayType) => {
    if (editor.editorMode === CREATE_MODE) {
      setArrayType(selectedType);
    }
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty(
        { name, value: { Bytes: { [selectedType]: value.Bytes[arrayType] } }, immutable },
        editor.propertyIndex,
      );
      setArrayType(selectedType);
    }
  };

  const onImmutableChanged = () => {
    setImmutable(!immutable);
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty({ name, value, immutable: !immutable }, editor.propertyIndex);
    }
  };

  const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>): void => {
    let stringToArray = typedValue.target.value.split(',').map((item) => parseInt(item));
    let candyBytes: CandyBytes = convertNat8ArrayToCandyBytes(stringToArray, arrayType);
    if (candyBytes) {
      setValue(candyBytes);
      setFormValue(typedValue.target.value);
      setIsInvalid(false);
      if (editor.editorMode === EDIT_MODE) {
        editor.editExistingProperty({ name, value: candyBytes, immutable }, editor.propertyIndex);
      }
    } else {
      setIsInvalid(true);
      setFormValue(typedValue.target.value);
      setValidationError(VALIDATION_ERRORS.bytesArray);
    }
  };

  useEffect(() => {
    if (editor.editorMode === EDIT_MODE) {
      const candyBytes = editor.property.value as CandyBytes;
      setName(editor.property.name);
      setValue(candyBytes);
      setImmutable(editor.property.immutable);
      setFormValue(candyBytes.Bytes[arrayType].toString());
    }
  }, [editor.editorMode]);

  return (
    <>
      {editor.editorMode === CREATE_MODE ? (
        <Container size="full">
          <TabContent
            tabs={[
              {
                title: 'Base64',
                id: 'Base64',
              },
              {
                title: 'Hexadecimal',
                id: 'Hexadecimal',
              },
              {
                title: 'File upload',
                id: 'File upload',
              },
            ]}
            fullWidth={true}
            justify="flex-start"
            content={[
              <div>base64</div>,
              <div>Hex</div>,
              <Flex flexFlow="column" gap={16}>
                <FileInput addPropertyToCandyClass={editor.addPropertyToCandyClass} />
              </Flex>,
            ]}
          />
        </Container>
      ) : (
        <>
          {editor.property.immutable ? (
            <>
              <Grid column={1}>
                <TextInput value={name} disabled={true} />
              </Grid>
              <Grid column={2}>
                <TextInput value={formValue} disabled={true} />
              </Grid>
              <Grid column={3}>
                <span>Property is immutable</span>
              </Grid>
              <Grid column={4}>
                <span>Property is immutable</span>
              </Grid>
            </>
          ) : (
            <>
              <Grid column={1}>
                <TextInput onChange={onNameChanged} value={name} />
              </Grid>
              <Grid column={2}>
                <Flex flexFlow="column" gap={16}>
                  <Flex>
                    <Select
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
                    {isInvalid ? (
                      <TextInput
                        inputSize="small"
                        onChange={onValueChanged}
                        error={validationError}
                        value={formValue}
                      />
                    ) : (
                      <>
                        <TextInput inputSize="small" onChange={onValueChanged} value={formValue} />
                      </>
                    )}
                  </Flex>
                </Flex>
              </Grid>
              <Grid column={3}>
                <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
              </Grid>
            </>
          )}
        </>
      )}
    </>
  );
};
