import React, { useState, useEffect } from 'react';
import { Flex, TextInput, CheckboxInput, Button, Grid, Select, HR } from '@origyn-sa/origyn-art-ui';
import type { CandyClassEditor, CandyBool } from '../../../types';
import { VALIDATION_ERRORS, CREATE_MODE, EDIT_MODE } from '../../../constants';
import { convertToCandyBool } from './converters';

export const BoolForm = (editor: CandyClassEditor) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<CandyBool>();
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

  const onValueChanged = (selectedValue: string) => {
    const boolValue = convertToCandyBool(selectedValue);
    if (boolValue) {
      setValue(boolValue);
      setFormValue(selectedValue);
      setIsInvalid(false);
      if (editor.editorMode === EDIT_MODE) {
        editor.editExistingProperty({ name, value: boolValue, immutable }, editor.propertyIndex);
      }
    } else {
      setIsInvalid(true);
      setFormValue(selectedValue);
      setValidationError(VALIDATION_ERRORS.boolean);
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
      const candyValue = editor.property.value as CandyBool;
      setName(editor.property.name);
      setValue(candyValue);
      setImmutable(editor.property.immutable);
      setFormValue(candyValue.Bool.valueOf().toString());
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
            <Select
              inputSize="medium"
              label="Value"
              handleChange={(opt) => {
                onValueChanged(opt.value);
              }}
              options={[
                { value: 'true', label: 'true' },
                { value: 'false', label: 'false' },
              ]}
            />
          </Flex>
          <Flex>
            <Flex>
              <CheckboxInput label="Immutable" name="immutable" onChange={onImmutableChanged} />
            </Flex>
          </Flex>
          <HR marginTop={8} marginBottom={16} />
          {isInvalid && (
            <>
              <Flex>{validationError}</Flex>
              <HR marginTop={8} marginBottom={16} />
            </>
          )}
          <Flex>
            <Button size="small" btnType="filled" onClick={saveProperty} disabled={isInvalid}>
              Save Property
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <Grid column={1}>
            <TextInput value={name} disabled={immutable} onChange={onNameChanged} />
          </Grid>
          {editor.property.immutable ? (
            <>
              <Grid column={2}>
                <Select
                  inputSize="medium"
                  selectedOption={{
                    value: formValue,
                    label: formValue,
                  }}
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
              <Grid column={2}>
                {isInvalid ? (
                  <Select
                    inputSize="medium"
                    handleChange={(opt) => {
                      onValueChanged(opt.value);
                    }}
                    options={[
                      { value: 'true', label: 'true' },
                      { value: 'false', label: 'false' },
                    ]}
                    error={true}
                  />
                ) : (
                  <Select
                    inputSize="medium"
                    handleChange={(opt) => {
                      onValueChanged(opt.value);
                    }}
                    options={[
                      { value: 'true', label: 'true' },
                      { value: 'false', label: 'false' },
                    ]}
                    selectedOption={{
                      value: formValue,
                      label: formValue,
                    }}
                  />
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
