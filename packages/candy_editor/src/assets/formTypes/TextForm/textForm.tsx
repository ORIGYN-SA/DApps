import React, { useEffect, useState } from 'react';
import { Flex, TextInput, CheckboxInput, Button, HR } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyText } from '../../../types';

export const TextForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyText>({ Text: '' });
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
    switch (editor.editorMode) {
      case 'create':
        editor.addPropertyToCandyClass({
          name: name,
          value: value,
          immutable: immutable,
        });
        break;
      case 'edit':
        alert('edit');
    }
  };

  useEffect(() => {
    if (editor.editorMode === 'edit') {
      const CandyValue = editor.property.value as CandyText;
      setName(editor.property.name);
      setValue(CandyValue);
    }
  }, [editor.editorMode]);

  return (
    <>
      <Flex>
        <TextInput label="Name" onChange={onNameChanged} value={name} />
      </Flex>
      <Flex>
        <TextInput label="Value" onChange={onValueChanged} value={value.Text} />
      </Flex>
      <Flex>
        <Flex>
          <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
        </Flex>
      </Flex>
      <HR marginTop={8} marginBottom={16} />
      {editor.editorMode === 'create' ? (
        <Flex>
          <span>
            <Button size="small" btnType="filled" onClick={saveProperty}>
              Save
            </Button>
          </span>
        </Flex>
      ) : (
        <></>
      )}
    </>
  );
};
