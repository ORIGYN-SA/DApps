import React, { useEffect, useState } from 'react';
import { Flex, TextInput, CheckboxInput, Button, Grid } from '@origyn-sa/origyn-art-ui';
import { CandyClassEditor, CandyText } from '../../../types';
import { CREATE_MODE, EDIT_MODE } from '../../../constants';
import { fontWeight } from '@mui/system';

export const TextForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyText>({ Text: '' });
  const [formValue, setFormValue] = useState<string>('');
  const [immutable, setImmutable] = useState<boolean>(false);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>): void => {
    setName(typedName.target.value);
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty(
        { name: typedName.target.value, value, immutable },
        editor.propertyIndex,
      );
    }
  };

  const onImmutableChanged = (): void => {
    setImmutable(!immutable);
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty({ name, value, immutable: !immutable }, editor.propertyIndex);
    }
  };

  const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>): void => {
    setValue({ Text: typedValue.target.value });
    setFormValue(typedValue.target.value);
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty(
        { name, value: { Text: typedValue.target.value }, immutable },
        editor.propertyIndex,
      );
    }
  };

  const saveProperty = (): void => {
    editor.addPropertyToCandyClass({
      name: name,
      value: value,
      immutable: immutable,
      id: Math.random().toString(),
    });
  };

  useEffect(() => {
    if (editor.editorMode === EDIT_MODE) {
      const candyValue = editor.property.value as CandyText;
      setName(editor.property.name);
      setValue(candyValue);
      setFormValue(candyValue.Text);
      setImmutable(editor.property.immutable);
    }
  }, [editor.editorMode]);

  return (
    <>
      {editor.editorMode === CREATE_MODE ? (
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
                <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  <b>{editor.candyType}</b>
                </span>
              </Grid>
              <Grid column={2}>
                <TextInput value={name} disabled={true} />
              </Grid>
              <Grid column={3}>
                <TextInput value={formValue} disabled={true} />
              </Grid>
              <Grid column={4}>
                <span>Property is immutable</span>
              </Grid>
              <Grid column={5}>
                <span>Property is immutable</span>
              </Grid>
            </>
          ) : (
            <>
              <Grid column={1}>
                <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  <b>{editor.candyType}</b>
                </span>
              </Grid>
              <Grid column={2}>
                <TextInput onChange={onNameChanged} value={name} />
              </Grid>
              <Grid column={3}>
                <TextInput onChange={onValueChanged} value={formValue} />
              </Grid>
              <Grid column={4}>
                <Flex>
                  <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
                </Flex>
              </Grid>
            </>
          )}
        </>
      )}
    </>
  );
};
