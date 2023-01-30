import React, { useState } from 'react';
import { Flex, Container, TextInput, CheckboxInput, Button, HR } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyNat16 } from '../../../types';
import { convertToNat16 } from './converters';
import { VALIDATION_ERRORS } from '../../../constants';

export const Nat16Form = (methods: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyNat16>();
  const [immutable, setImmutable] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
    setName(typedName.target.value);
  };
  const onImmutableChanged = () => {
    setImmutable(!immutable);
  };
  const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>) => {
    const nat16Value = convertToNat16(typedValue.target.value);
    if (nat16Value) {
      setValue(nat16Value);
      setIsInvalid(false);
    } else {
      setIsInvalid(true);
    }
  };
  const saveProperty = () => {
    methods.addPropertyToCandyClass({
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
          <Flex>{VALIDATION_ERRORS.NAT16}</Flex>
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
