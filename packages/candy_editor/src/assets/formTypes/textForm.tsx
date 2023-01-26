import React, { useContext, useEffect, useState } from 'react';
import { Flex, Container, TextInput, CheckboxInput, Button, HR } from '@origyn-sa/origyn-art-ui';
import type { CandyValue, Property, CandyClassEditor } from '../../types';

export const TextForm = (methods : CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyValue>({ Text: '' });
  const [immutable, setImmutable] = useState<boolean>(false);

  const getTypedName = (e) => {
    setName(e.target.value);
  };
  const handleChangeImmutable = () => {
    setImmutable(!immutable);
  };
  const getTypedValue = (e) => {
    let textValue: CandyValue = { Text: e.target.value };
    setValue(textValue);
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
          <TextInput label="Name" onChange={getTypedName} />
        </Flex>
        <Flex>
          <TextInput label="Value" onChange={getTypedValue} />
        </Flex>
        <Flex>
          <Flex>
            <CheckboxInput label="Immutable" name="immutable" onChange={handleChangeImmutable} />
          </Flex>
        </Flex>
      </Flex>
      <HR marginTop={8} marginBottom={16} />
      <Flex>
        <Button size="small" btnType="filled" onClick={saveProperty}>
          Save Property
        </Button>
      </Flex>
    </Container>
  );
};
