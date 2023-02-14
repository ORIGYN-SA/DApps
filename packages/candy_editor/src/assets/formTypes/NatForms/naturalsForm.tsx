import React, { useState, useEffect } from 'react';
import { Flex, TextInput, CheckboxInput, Button, Grid } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyNaturals } from '../../../types';
import { VALIDATION_ERRORS, EDIT_MODE, CREATE_MODE } from '../../../constants';
import {
  convertToCandyNat,
  convertToCandyNat8,
  convertToCandyNat16,
  convertToCandyNat32,
  convertToCandyNat64,
  convertNaturalNumberToString,
} from './converters';

export const NaturalsForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyNaturals>();
  const [formValue, setFormValue] = useState<string>('');
  const [immutable, setImmutable] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>(null);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
    setName(typedName.target.value);
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty(
        { name: typedName.target.value, value, immutable },
        editor.propertyIndex,
      );
    }
  };

  const onImmutableChanged = () => {
    setImmutable(!immutable);
    if (editor.editorMode === EDIT_MODE) {
      editor.editExistingProperty({ name, value, immutable: !immutable }, editor.propertyIndex);
    }
  };

  const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>): void => {
    let naturalValue: CandyNaturals;
    switch (editor.candyType) {
      case 'Nat':
        naturalValue = convertToCandyNat(typedValue.target.value);
        if (naturalValue) {
          setValue(naturalValue);
          setFormValue(typedValue.target.value);
          setIsInvalid(false);
          if (editor.editorMode === EDIT_MODE) {
            editor.editExistingProperty(
              { name, value: naturalValue, immutable },
              editor.propertyIndex,
            );
          }
        } else {
          setIsInvalid(true);
          setFormValue(typedValue.target.value);
          setValidationError(VALIDATION_ERRORS.nat);
        }
        break;
      case 'Nat8':
        naturalValue = convertToCandyNat8(typedValue.target.value);
        if (naturalValue) {
          setValue(naturalValue);
          setFormValue(typedValue.target.value);
          setIsInvalid(false);
          if (editor.editorMode === EDIT_MODE) {
            editor.editExistingProperty(
              { name, value: naturalValue, immutable },
              editor.propertyIndex,
            );
          }
        } else {
          setIsInvalid(true);
          setFormValue(typedValue.target.value);
          setValidationError(VALIDATION_ERRORS.nat8);
        }
        break;
      case 'Nat16':
        naturalValue = convertToCandyNat16(typedValue.target.value);
        if (naturalValue) {
          setValue(naturalValue);
          setFormValue(typedValue.target.value);
          setIsInvalid(false);
          if (editor.editorMode === EDIT_MODE) {
            editor.editExistingProperty(
              { name, value: naturalValue, immutable },
              editor.propertyIndex,
            );
          }
        } else {
          setIsInvalid(true);
          setFormValue(typedValue.target.value);
          setValidationError(VALIDATION_ERRORS.nat16);
        }
        break;
      case 'Nat32':
        naturalValue = convertToCandyNat32(typedValue.target.value);
        if (naturalValue) {
          setValue(naturalValue);
          setFormValue(typedValue.target.value);
          setIsInvalid(false);
          if (editor.editorMode === EDIT_MODE) {
            editor.editExistingProperty(
              { name, value: naturalValue, immutable },
              editor.propertyIndex,
            );
          }
        } else {
          setIsInvalid(true);
          setFormValue(typedValue.target.value);
          setValidationError(VALIDATION_ERRORS.nat32);
        }
        break;
      case 'Nat64':
        naturalValue = convertToCandyNat64(typedValue.target.value);
        if (naturalValue) {
          setValue(naturalValue);
          setFormValue(typedValue.target.value);
          setIsInvalid(false);
          if (editor.editorMode === EDIT_MODE) {
            editor.editExistingProperty(
              { name, value: naturalValue, immutable },
              editor.propertyIndex,
            );
          }
        } else {
          setIsInvalid(true);
          setFormValue(typedValue.target.value);
          setValidationError(VALIDATION_ERRORS.nat64);
        }
        break;
    }
  };

  const saveProperty = () => {
    editor.addPropertyToCandyClass({
      name: name,
      value: value,
      immutable: immutable,
      id: Math.random().toString(),
    });
  };

  useEffect(() => {
    if (editor.editorMode === EDIT_MODE) {
      const candyValue = editor.property.value as CandyNaturals;
      setName(editor.property.name);
      setValue(candyValue);
      setImmutable(editor.property.immutable);
      setFormValue(convertNaturalNumberToString(candyValue, editor.candyType));
    }
  }, [editor.editorMode]);

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
                {isInvalid ? (
                  <TextInput onChange={onValueChanged} error={validationError} value={formValue} />
                ) : (
                  <TextInput onChange={onValueChanged} value={formValue} />
                )}
              </Grid>
              <Grid column={4}>
                <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
              </Grid>
            </>
          )}
        </>
      )}
    </>
  );
};
