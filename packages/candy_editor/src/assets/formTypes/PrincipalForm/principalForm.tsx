import React, { useState, useEffect } from 'react';
import { Flex, TextInput, CheckboxInput, Button, Grid } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyPrincipal } from '../../../types';
import { VALIDATION_ERRORS, CREATE_MODE, EDIT_MODE } from '../../../constants';
import { convertToCandyPrincipal } from './converters';

export const PrincipalForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyPrincipal>({ Principal: null });
  const [formValue, setFormValue] = useState<string>('');
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
    const principalValue = convertToCandyPrincipal(typedValue.target.value);
    if (principalValue) {
      setValue(principalValue);
      setFormValue(typedValue.target.value);
      setIsInvalid(false);
    } else {
      setFormValue(typedValue.target.value);
      setIsInvalid(true);
      setValidationError(VALIDATION_ERRORS.principal);
    }
  };

  const saveProperty = () => {
    editor.addPropertyToCandyClass({
      name: name,
      value: value,
      immutable: immutable,
    });
  };

  useEffect(() => {
    if (editor.editorMode === EDIT_MODE) {
      const candyValue = editor.property.value as CandyPrincipal;
      setName(editor.property.name);
      setValue(candyValue);
      setImmutable(editor.property.immutable);
      setFormValue(candyValue.Principal.toString());
    }
  }, [editor.editorMode]);

  useEffect(() => {
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty({
        name: name,
        value: value,
        immutable: immutable,
      });
    }
  }, [name, value, immutable]);

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
          {editor.property.immutable ? (
            <>
              <Grid column={1}>
                <TextInput value={name} disabled={true} />
              </Grid>
              <Grid column={2}>
                <TextInput value={formValue} disabled={true} />
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
                {isInvalid ? (
                  <TextInput onChange={onValueChanged} error={validationError} value={formValue} />
                ) : (
                  <TextInput onChange={onValueChanged} value={formValue} />
                )}
              </Grid>
              <Grid column={3}>
                <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
              </Grid>
            </>
          )}
        </>
      )}
    </>
  );
};