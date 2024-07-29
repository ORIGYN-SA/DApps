import React, { useState, useEffect } from 'react';
import { Flex, TextInput, CheckboxInput, Button, Grid } from '@origyn/origyn-art-ui';
import type { CandyClassEditor, CandyIntegers } from '@dapp/common-types';
import { VALIDATION_ERRORS, EDIT_MODE, CREATE_MODE } from '../../../constants';
import {
  convertToCandyInt,
  convertToCandyInt8,
  convertToCandyInt16,
  convertToCandyInt32,
  convertToCandyInt64,
  convertIntegerNumberToString,
} from './converters';

export const IntegersForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyIntegers>();
  const [formValue, setFormValue] = useState<string>('');
  const [immutable, setImmutable] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  const onNameChanged = (typedName: React.ChangeEvent<HTMLInputElement>) => {
    setName(typedName.target.value);
    if (editor.editorMode === EDIT_MODE && editor.editExistingProperty && editor.propertyIndex) {
      editor.editExistingProperty(
        { name: typedName.target.value, value, immutable },
        editor.propertyIndex,
      );
    }
  };

  const onImmutableChanged = () => {
    setImmutable(!immutable);
    if (editor.editorMode === EDIT_MODE && editor.editExistingProperty && editor.propertyIndex) {
      editor.editExistingProperty({ name, value, immutable: !immutable }, editor.propertyIndex);
    }
  };

  const onValueChanged = (typedValue: React.ChangeEvent<HTMLInputElement>): void => {
    let integerValue: CandyIntegers;
    switch (editor.candyType) {
      case 'Int':
        integerValue = convertToCandyInt(typedValue.target.value) as CandyIntegers;
        if (integerValue) {
          setValue(integerValue);
          setFormValue(typedValue.target.value);
          setIsInvalid(false);
          if (
            editor.editorMode === EDIT_MODE &&
            editor.editExistingProperty &&
            editor.propertyIndex
          ) {
            editor.editExistingProperty(
              { name, value: integerValue, immutable },
              editor.propertyIndex,
            );
          }
        } else {
          setIsInvalid(true);
          setFormValue(typedValue.target.value);
          setValidationError(VALIDATION_ERRORS.int);
        }
        break;
      case 'Int8':
        integerValue = convertToCandyInt8(typedValue.target.value) as CandyIntegers;
        if (integerValue) {
          setValue(integerValue);
          setFormValue(typedValue.target.value);
          setIsInvalid(false);
          if (
            editor.editorMode === EDIT_MODE &&
            editor.editExistingProperty &&
            editor.propertyIndex
          ) {
            editor.editExistingProperty(
              { name, value: integerValue, immutable },
              editor.propertyIndex,
            );
          }
        } else {
          setIsInvalid(true);
          setFormValue(typedValue.target.value);
          setValidationError(VALIDATION_ERRORS.int8);
        }
        break;
      case 'Int16':
        integerValue = convertToCandyInt16(typedValue.target.value) as CandyIntegers;
        if (integerValue) {
          setValue(integerValue);
          setFormValue(typedValue.target.value);
          setIsInvalid(false);
          if (
            editor.editorMode === EDIT_MODE &&
            editor.editExistingProperty &&
            editor.propertyIndex
          ) {
            editor.editExistingProperty(
              { name, value: integerValue, immutable },
              editor.propertyIndex,
            );
          }
        } else {
          setIsInvalid(true);
          setFormValue(typedValue.target.value);
          setValidationError(VALIDATION_ERRORS.int16);
        }
        break;
      case 'Int32':
        integerValue = convertToCandyInt32(typedValue.target.value) as CandyIntegers;
        if (integerValue) {
          setValue(integerValue);
          setFormValue(typedValue.target.value);
          setIsInvalid(false);
          if (
            editor.editorMode === EDIT_MODE &&
            editor.editExistingProperty &&
            editor.propertyIndex
          ) {
            editor.editExistingProperty(
              { name, value: integerValue, immutable },
              editor.propertyIndex,
            );
          }
        } else {
          setIsInvalid(true);
          setFormValue(typedValue.target.value);
          setValidationError(VALIDATION_ERRORS.int32);
        }
        break;
      case 'Int64':
        integerValue = convertToCandyInt64(typedValue.target.value) as CandyIntegers;
        if (integerValue) {
          setValue(integerValue);
          setFormValue(typedValue.target.value);
          setIsInvalid(false);
          if (
            editor.editorMode === EDIT_MODE &&
            editor.editExistingProperty &&
            editor.propertyIndex
          ) {
            editor.editExistingProperty(
              { name, value: integerValue, immutable },
              editor.propertyIndex,
            );
          }
        } else {
          setIsInvalid(true);
          setFormValue(typedValue.target.value);
          setValidationError(VALIDATION_ERRORS.int64);
        }
        break;
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
      const candyValue = editor.property.value as CandyIntegers;
      setName(editor.property.name);
      setValue(candyValue);
      setImmutable(editor.property.immutable);
      setFormValue(convertIntegerNumberToString(candyValue, editor.candyType ?? ''));
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
              <b>{String(editor.candyType)}</b>
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
