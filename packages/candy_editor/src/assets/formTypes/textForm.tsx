import React, { useState } from 'react';
import { Flex, Container, TextInput, CheckboxInput, Button, HR } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor,CandyText } from '../../types';

export const TextForm = (editor : CandyClassEditor) => {
  
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyText>();
  const [immutable, setImmutable] = useState<boolean>(false);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
    setName(typedName.target.value);
  };

  const onImmutableChanged = () => {
    setImmutable(!immutable);
  };

  const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ Text: typedValue.target.value });
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
      <Flex>
        <Button size="small" btnType="filled" onClick={saveProperty}>
          Save Property
        </Button>
      </Flex>
    </Container>
  );
};
