import React, { useEffect, useState } from 'react';
import { Flex, TextInput, CheckboxInput, Button, Grid } from '@origyn/origyn-art-ui';
import { CandyClassEditor, CandyText } from '@dapp/common-types';
import { CREATE_MODE, EDIT_MODE } from '../../../constants';

export const TextForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyText>({ Text: '' });
  const [formValue, setFormValue] = useState<string>('');
  const [immutable, setImmutable] = useState<boolean>(false);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>): void => {
    setName(typedName.target.value);
    if (
      editor.editorMode === EDIT_MODE &&
      editor &&
      editor.editExistingProperty &&
      editor.propertyIndex
    ) {
      editor.editExistingProperty(
        { name: typedName.target.value, value, immutable },
        editor.propertyIndex,
      );
    }
  };

  const onImmutableChanged = (): void => {
    setImmutable(!immutable);
    if (
      editor.editorMode === EDIT_MODE &&
      editor &&
      editor.editExistingProperty &&
      editor.propertyIndex
    ) {
      editor.editExistingProperty({ name, value, immutable: !immutable }, editor.propertyIndex);
    }
  };

  const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>): void => {
    setValue({ Text: typedValue.target.value });
    setFormValue(typedValue.target.value);
    if (
      editor.editorMode === EDIT_MODE &&
      editor &&
      editor.editExistingProperty &&
      editor.propertyIndex
    ) {
      editor.editExistingProperty(
        { name, value: { Text: typedValue.target.value }, immutable },
        editor.propertyIndex,
      );
    }
  };

  const saveProperty = (): void => {
    if (editor && editor.addPropertyToCandyClass) {
      editor.addPropertyToCandyClass({
        name: name,
        value: value,
        immutable: immutable,
        id: Math.random().toString(),
      });
    }
  }

    useEffect(() => {
      if (editor.editorMode === EDIT_MODE && editor.property) {
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
            <Grid columns={1}>
              <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <b>{editor.candyType ? editor.candyType.toString() : ''}</b>
              </span>
            </Grid>
            <Grid columns={2}>
              <TextInput value={name} disabled={immutable} onChange={onNameChanged} />
            </Grid>
            <Grid columns={3}>
              <TextInput value={formValue} disabled={immutable} onChange={onValueChanged} />
            </Grid>
            <Grid columns={4}>
              {editor.property && editor.property.immutable ? (
                <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  Property is immutable
                </span>
              ) : (
                <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
              )}
            </Grid>
            {editor.property && editor.property.immutable &&  (
              <>
                <Grid columns={5}>
                  <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    Property is immutable
                  </span>
                </Grid>
              </>
            )}
          </>
        )}
      </>
    );
  };
