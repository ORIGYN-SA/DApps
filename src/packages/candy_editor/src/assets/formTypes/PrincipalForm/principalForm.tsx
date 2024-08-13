import React, { useState, useEffect } from 'react';
import { Flex, TextInput, CheckboxInput, Button, Grid } from '@origyn/origyn-art-ui';
import type { CandyClassEditor, CandyPrincipal } from '@dapp/common-types';
import { VALIDATION_ERRORS, CREATE_MODE, EDIT_MODE } from '../../../constants';
import { convertToCandyPrincipal } from './converters';

export const PrincipalForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyPrincipal>({ Principal: null });
  const [formValue, setFormValue] = useState<string>('');
  const [immutable, setImmutable] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
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

  const onImmutableChanged = () => {
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

  const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>) => {
    const principalValue = convertToCandyPrincipal(typedValue.target.value);
    if (principalValue) {
      setValue(principalValue);
      setFormValue(typedValue.target.value);
      setIsInvalid(false);
      if (
        editor.editorMode === EDIT_MODE &&
        editor &&
        editor.editExistingProperty &&
        editor.propertyIndex
      ) {
        editor.editExistingProperty(
          { name, value: principalValue, immutable },
          editor.propertyIndex,
        );
      }
    } else {
      setFormValue(typedValue.target.value);
      setIsInvalid(true);
      setValidationError(VALIDATION_ERRORS.principal);
    }
  };

  const saveProperty = () => {
    if (editor.addPropertyToCandyClass) {
      editor.addPropertyToCandyClass({
        name: name,
        value: value,
        immutable: immutable,
        id: Math.random().toString(),
      });
    }
  };

  useEffect(() => {
    if (editor.editorMode === EDIT_MODE && editor.property) {
      const candyValue = editor.property.value as CandyPrincipal;
      setName(editor.property.name);
      setValue(candyValue);
      setImmutable(editor.property.immutable);
      setFormValue(candyValue.Principal?.toString() ?? '');
    }
  }, [editor.editorMode]);

  if (!editor.property) {
    return null;
  }

  return (
    <>
      {editor.editorMode === CREATE_MODE ? (
        <>
          <Flex>
            <TextInput label="Name" onChange={onNameChanged} />
          </Flex>
          <Flex>
            {isInvalid ? (
              <TextInput label="Value" onChange={onValueChanged} error={validationError} />
            ) : (
              <TextInput label="Value" onChange={onValueChanged} />
            )}
          </Flex>
          <Flex>
            <Flex>
              <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
            </Flex>
          </Flex>
          <Flex>
            <Button size="small" btnType="filled" onClick={saveProperty} disabled={isInvalid}>
              Save Property
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <Grid columns={1}>
            <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <b>{editor.candyType?.toString()}</b>
            </span>
          </Grid>
          <Grid columns={2}>
            <TextInput value={name} disabled={immutable} onChange={onNameChanged} />
          </Grid>
          <Grid columns={3}>
            {isInvalid ? (
              <TextInput onChange={onValueChanged} error={validationError} value={formValue} />
            ) : (
              <TextInput onChange={onValueChanged} value={formValue} disabled={immutable} />
            )}
          </Grid>
          <Grid columns={4}>
            {editor.property.immutable ? (
              <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>Property is immutable</span>
            ) : (
              <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
            )}
          </Grid>
          {editor.property.immutable && (
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
