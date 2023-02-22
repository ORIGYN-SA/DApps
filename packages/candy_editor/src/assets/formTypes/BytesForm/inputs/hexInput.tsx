import React, { useState } from 'react';
import {
  Flex,
  TextInput,
  CheckboxInput,
  Button,
  Select,
  HR,
  Container,
} from '@origyn-sa/origyn-art-ui';
import { convertHexadecimalToCandyBytes } from '../binaryConverters';
import { VALIDATION_ERRORS } from '../../../../constants';
import { BytesFormInput, CandyBytes, ArrayType } from '../../../../types';

export const HexadecimalInput = (input: BytesFormInput) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyBytes>();
  const [arrayType, setArrayType] = useState<ArrayType>('thawed');
  const [immutable, setImmutable] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
    setName(typedName.target.value);
  };

  const onTypeChanged = (selectedType: ArrayType) => {
    setArrayType(selectedType);
  };

  const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>) => {
    let hexadecimalValue = convertHexadecimalToCandyBytes(typedValue.target.value, arrayType);
    if (hexadecimalValue) {
      setIsInvalid(false);
      setValue(hexadecimalValue);
    } else {
      setIsInvalid(true);
    }
  };

  const onImmutableChanged = () => {
    setImmutable(!immutable);
  };

  const saveProperty = () => {
    input.addPropertyToCandyClass({
      name: name,
      value: value,
      immutable: immutable,
      id: Math.random().toString(),
    });
  };

  return (
    <>
      <HR marginTop={16} marginBottom={16} />
      <Container>
        <Flex flexFlow="column" gap={16}>
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
            {isInvalid ? (
              <TextInput
                label="Base64 String"
                onChange={onValueChanged}
                error={VALIDATION_ERRORS.hexadecimal}
              />
            ) : (
              <TextInput label="Hexadecimal String" onChange={onValueChanged} />
            )}
          </Flex>
          <Flex>
            <Flex>
              <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
            </Flex>
          </Flex>
          <Flex>
            <Button size="small" btnType="filled" onClick={saveProperty}>
              Save Property
            </Button>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};
