import React, { useState } from 'react';
import { Flex, Container, TextInput, CheckboxInput, Button, HR } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyNaturals } from '../../../types';
import { VALIDATION_ERRORS } from '../../../constants';
import {
  convertToCandyNat,
  convertToCandyNat8,
  convertToCandyNat16,
  convertToCandyNat32,
  convertToCandyNat64,
} from './converters';

export const NaturalsForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyNaturals>();
  const [immutable, setImmutable] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>(null);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
    setName(typedName.target.value);
  };

  const onImmutableChanged = () => {
    setImmutable(!immutable);
  };

  const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>) => {
    switch (editor.candyType) {
      case 'Nat':
        const natValue = convertToCandyNat(typedValue.target.value);
        if (natValue) {
          setValue(natValue);
          setIsInvalid(false);
        } else {
          setIsInvalid(true);
          setValidationError(VALIDATION_ERRORS.NAT);
        }
        break;
      case 'Nat8':
        const nat8Value = convertToCandyNat8(typedValue.target.value);
        if (nat8Value) {
          setValue(nat8Value);
          setIsInvalid(false);
        } else {
          setIsInvalid(true);
          setValidationError(VALIDATION_ERRORS.NAT8);
        }
        break;
      case 'Nat16':
        const nat16Value = convertToCandyNat16(typedValue.target.value);
        if (nat16Value) {
          setValue(nat16Value);
          setIsInvalid(false);
        } else {
          setIsInvalid(true);
          setValidationError(VALIDATION_ERRORS.NAT16);
        }
        break;
      case 'Nat32':
        const nat32Value = convertToCandyNat32(typedValue.target.value);
        if (nat32Value) {
          setValue(nat32Value);
          setIsInvalid(false);
        } else {
          setIsInvalid(true);
          setValidationError(VALIDATION_ERRORS.NAT32);
        }
        break;
      case 'Nat64':
        const nat64Value = convertToCandyNat64(typedValue.target.value);
        if (nat64Value) {
          setValue(nat64Value);
          setIsInvalid(false);
        } else {
          setIsInvalid(true);
          setValidationError(VALIDATION_ERRORS.NAT64);
        }
        break;
    }
  };

  const saveProperty = () => {
    editor.addPropertyToCandyClass({
      name: name,
      value: value,
      immutable: immutable,
    });
  };

  return (
    <Container>
      <Flex flexFlow="row" gap={16}>
        <Flex>
          <TextInput label="Name" onChange={onNameChanged} />
        </Flex>
        <Flex>
          <TextInput label="Value" onChange={onValueChanged} />
        </Flex>
        <Flex>
          <Flex>
            <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
          </Flex>
        </Flex>
      </Flex>
      <HR marginTop={8} marginBottom={16} />
      {isInvalid && (
        <>
          <Flex>{validationError}</Flex>
          <HR marginTop={8} marginBottom={16} />
        </>
      )}
      <Flex>
        <Button size="small" btnType="filled" onClick={saveProperty} disabled={isInvalid}>
          Save Property
        </Button>
      </Flex>
    </Container>
  );
};
