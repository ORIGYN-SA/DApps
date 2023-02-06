import React, { useState, useEffect } from 'react';
import { Flex, TextInput, CheckboxInput, Button, Grid } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyNaturals } from '../../../types';
import { VALIDATION_ERRORS } from '../../../constants';
import {
  convertToCandyNat,
  convertToCandyNat8,
  convertToCandyNat16,
  convertToCandyNat32,
  convertToCandyNat64,
  convertNaturalNumberToString
} from './converters';

export const NaturalsForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyNaturals>();
  const [formValue, setFormValue] = useState<string>('');
  const [immutable, setImmutable] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>(null);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
    setName(typedName.target.value);
  };

  const onImmutableChanged = () => {
    setImmutable(!immutable);
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
        } else {
          setIsInvalid(true);
          setFormValue(typedValue.target.value);
          setValidationError(VALIDATION_ERRORS.nat64);
        }
        break;
    }
  };

  const onRemove = (): void => {
    if (editor.editorMode === 'edit') editor.removePropertyFromCandyClass(editor.property);
  };

  const saveProperty = () => {
    editor.addPropertyToCandyClass({
      name: name,
      value: value,
      immutable: immutable,
    });
  };

  useEffect(() => {
    if (editor.editorMode === 'edit') {
      const candyValue = editor.property.value as CandyNaturals;
      setName(editor.property.name);
      setValue(candyValue);
      setImmutable(editor.property.immutable);
      setFormValue(convertNaturalNumberToString(candyValue, editor.candyType));
      console.log('property', editor.property)
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

  return (
    <>
      {editor.editorMode === 'create' ? (
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
                <TextInput
                  value={name}
                  disabled={immutable}
                />
              </Grid>
              <Grid column={2}>
                <TextInput
                  value={formValue}
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
                {isInvalid ? (
                  <TextInput
                    onChange={onValueChanged}
                    error={validationError}
                    value={formValue}
                  />
                ) : (
                  <TextInput onChange={onValueChanged} value={formValue} />
                )}
              </Grid>
              <Grid column={3}>
                <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
              </Grid>
              <Grid column={4}>
                <Flex>
                  <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    <Button size="small" btnType="filled" onClick={() => onRemove()}>
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
