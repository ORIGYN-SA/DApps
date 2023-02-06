import React, { useEffect, useState } from 'react';
import { Flex, TextInput, CheckboxInput, Button, Grid } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyText } from '../../../types';

export const TextForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyText>({ Text: '' });
  const [formValue, setFormValue] = useState<string>('');
  const [immutable, setImmutable] = useState<boolean>(false);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>): void => {
    setName(typedName.target.value);
  };

  const onImmutableChanged = (): void => {
    setImmutable(!immutable);
  };

  const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>): void => {
    setValue({ Text: typedValue.target.value });
    setFormValue(typedValue.target.value);
  };

  const onRemove = (): void => {
    setIsRemoved(true);
  };

  const saveProperty = (): void => {
    editor.addPropertyToCandyClass({
      name: name,
      value: value,
      immutable: immutable,
    });
  };

  useEffect(() => {
    if (editor.editorMode === 'edit') {
      const candyValue = editor.property.value as CandyText;
      setName(editor.property.name);
      setValue(candyValue);
      setImmutable(editor.property.immutable);
      setFormValue(candyValue.Text);
    }
  }, [editor.editorMode]);

  useEffect(() => {
    if (editor.editorMode === 'edit') {
      editor.editExistingProperty({
        name: name,
        value: value,
        immutable: immutable,
      });
    }
  }, [name, value, immutable]);

  useEffect(() => {
    if (editor.editorMode === 'edit') editor.removePropertyFromCandyClass(editor.property);
  }, [isRemoved]);

  return (
    <>
      {editor.editorMode === 'create' ? (
        <>
          <Flex>
            <TextInput label="Name" onChange={onNameChanged} value={name} />
          </Flex>
          <Flex>
            <TextInput label="Value" onChange={onValueChanged} value={formValue} />
          </Flex>
          <Flex>
            <Flex>
              <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
            </Flex>
          </Flex>
          <Flex>
            <span>
              <Button size="small" btnType="filled" onClick={saveProperty}>
                Save
              </Button>
            </span>
          </Flex>
        </>
      ) : (
        <>
          {editor.property.immutable ? (
            <>
              <Grid column={1}>
                <TextInput
                  value={name}
                  disabled={immutable}
                />
              </Grid>
              <Grid column={2}>
                <TextInput
                  value={value.Text}
                  disabled={immutable}
                />
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
                <TextInput onChange={onValueChanged} value={formValue} />
              </Grid>
              <Grid column={3}>
                <Flex>
                  <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
                </Flex>
              </Grid>
              <Grid column={4}>
                <Flex>
                  <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    <Button size="small" btnType="filled" onClick={onRemove}>
                      Remove CandyValue
                    </Button>
                  </span>
                </Flex>
              </Grid>
            </>
          )}
        </>
      )}
    </>
  );
};
