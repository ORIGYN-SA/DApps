import React, { useEffect, useState } from 'react';
import {
  Card,
  Flex,
  Grid,
  Button,
  HR,
  Select,
  Container,
  Modal,
  Toggle,
} from '@origyn-sa/origyn-art-ui';
import { FormTypes } from './formTypes';
import type {
  Property,
  CandyClassEditor,
  CandyClass,
  CandyType,
  EditorMode,
  PropertyWithId,
  EditableCandyClass,
  CandyDataEditorProps,
} from '../types';
import { getValueType } from '../utils/functions';
import { NOT_SELECTED, SELECT_OPTIONS, CREATE_MODE, EDIT_MODE, MESSAGES } from '../constants';

export const CandyDataEditor = (candyDataEditor: CandyDataEditorProps) => {
  const [candyType, setCandyType] = useState<CandyType>(NOT_SELECTED);
  const [candyClass, setCandyClass] = useState<CandyClass>({ Class: [] });
  const [editableCandyClass, setEditableCandyClass] = useState<EditableCandyClass>({ Class: [] });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<EditorMode>(EDIT_MODE);
  const [readOnly, setReadOnly] = useState<boolean>(false);

  const addCandyClassEditor: CandyClassEditor = {
    addPropertyToCandyClass: (property: PropertyWithId) => {
      setEditableCandyClass((previous) => {
        const newClass = [...previous.Class, property];
        return {
          ...{
            Class: newClass,
          },
        };
      });
    },
    candyType: candyType,
    editorMode: editorMode,
  };

  const removeProperty = (propertyIndex: number): void => {
    setEditableCandyClass((previous) => {
      const firstPart = previous.Class.slice(0, propertyIndex);
      const secondPart = previous.Class.slice(propertyIndex + 1);
      return {
        ...{
          Class: [...firstPart, ...secondPart],
        },
      };
    });
  };

  const editExistingProperty = (updatedProperty: Property, propertyIndex: number) => {
    console.log('🚀 UPDATED PROPERTY #' + propertyIndex, updatedProperty);
    const updated = editableCandyClass.Class.map((property, index) => {
      if (index === propertyIndex) {
        return { ...property, ...updatedProperty };
      }
      return property;
    });
    setEditableCandyClass({ Class: updated });
  };

  const createEditCandyClassEditor = (
    candyType: string,
    property: Property,
    propertyIndex: number,
  ): CandyClassEditor => {
    return {
      candyType,
      editorMode,
      editExistingProperty: (updatedProperty: Property) =>
        editExistingProperty(updatedProperty, propertyIndex),
      property,
    };
  };

  const handleToggleReadOnly = (): void => {
    setReadOnly(!readOnly);
  };

  const displayModal = (): void => {
    setOpenModal(true);
    setEditorMode(CREATE_MODE);
  };

  const closeModal = (): void => {
    setOpenModal(false);
    setCandyType(NOT_SELECTED);
    setEditorMode(EDIT_MODE);
  };

  const handleSelectChange = (candySelectedType: CandyClass): void => {
    setCandyType(candySelectedType);
  };

  const saveCandyClass = (): void => {
    let properties: Property[] = editableCandyClass.Class.map((property) => {
      return {
        name: property.name,
        immutable: property.immutable,
        value: property.value,
      };
    }
    );
    setCandyClass({ Class: properties })
  };

  useEffect(() => {
    setCandyType(NOT_SELECTED);
    closeModal();
  }, [editableCandyClass]);

  useEffect(() => {
    console.log('🍬 CANDYCLASS', candyClass);
  }, [candyClass]);

  useEffect(() => {
    setCandyClass(candyDataEditor.existingCandyClass);
    if (candyDataEditor.existingCandyClass) {
      let propertiesWithId: PropertyWithId[] = candyDataEditor.existingCandyClass.Class.map(
        (property) => {
          return {
            name: property.name,
            immutable: property.immutable,
            value: property.value,
            id: Math.random().toString(),
          };
        }
      );
      setEditableCandyClass({ Class: propertiesWithId });
    }

    if (candyDataEditor.readOnly) {
      setReadOnly(true);
    }
  }, []);

  return (
    <Card type="outlined" padding="16px">
      <Container>
        <Flex flexFlow="column" gap={16}>
          <Flex>
            <Toggle
              checked={readOnly}
              disabled={candyDataEditor?.readOnly}
              handleToggle={() => handleToggleReadOnly()}
              style={{ marginBottom: 'auto', marginTop: 'auto' }}
            />
            <span style={{ marginLeft: '16px' }}>
              {candyDataEditor.readOnly ? MESSAGES.readOnlyMode : 'Read Only Mode'}
            </span>

          </Flex>
          <HR marginTop={8} marginBottom={8} />
          {readOnly ? (
            <>
              {candyClass?.Class?.length > 0 ? (
                <>
                  <pre>
                    {JSON.stringify(
                      candyClass,
                      (key, value) => (typeof value === 'bigint' ? value.toString() : value),
                      4,
                    )}
                  </pre>
                </>
              ) : (
                <>
                  <span>{MESSAGES.emptyCandyClass}</span>
                </>
              )}
            </>
          ) : (
            <>
              <Flex>
                <Button size="small" btnType="filled" onClick={displayModal}>
                  + Add Candy Value
                </Button>
              </Flex>
              {editableCandyClass.Class.length > 0 ? (
                <>
                  <HR marginTop={8} marginBottom={8} />
                  <Grid columns={4} gap={16}>
                    <Grid column={1}>Property Name</Grid>
                    <Grid column={2}>Property Value</Grid>
                    <Grid column={3}>Immutable</Grid>
                    <Grid column={4}>Actions</Grid>
                  </Grid>
                  <>
                    {editableCandyClass.Class.map((property, index) => {
                      const item = getValueType(property);
                      return (
                        <>
                          <Grid columns={4} gap={16} key={property.id}>
                            {FormTypes[item.type](
                              createEditCandyClassEditor(item.type, property, index),
                            )}
                            {!property.immutable && (
                              <Grid column={4}>
                                <Flex>
                                  <span style={{ marginBottom: 'auto', marginTop: 'auto' }}>
                                    <Button
                                      size="small"
                                      btnType="filled"
                                      onClick={() => removeProperty(index)}
                                    >
                                      Remove
                                    </Button>
                                  </span>
                                </Flex>
                              </Grid>
                            )}
                          </Grid>
                          <HR marginTop={8} marginBottom={8} />
                        </>
                      );
                    })}
                  </>
                  <Flex flexFlow="column" gap={24}>
                    <Flex align="flex-end" justify="flex-end">
                      {editableCandyClass !== candyClass && (
                        <>
                          <Button size="medium" btnType="filled" onClick={() => saveCandyClass()}>
                            Save Candy Class
                          </Button>
                        </>
                      )}
                    </Flex>
                  </Flex>
                </>
              ) : null}
            </>
          )}
        </Flex>
      </Container>
      <Modal closeModal={closeModal} isOpened={openModal} mode="light" size="lg">
        <Container size="full" padding="48px">
          <Flex flexFlow="column" gap={16}>
            <Flex>
              <Select
                inputSize="medium"
                label="Select Candy Type"
                handleChange={(type) => {
                  handleSelectChange(type.value);
                }}
                options={SELECT_OPTIONS.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
              />
            </Flex>
            <Flex flexFlow="column" gap={16}>
              {candyType !== null ? (
                FormTypes[candyType.toString()](addCandyClassEditor)
              ) : (
                <>
                  <Flex>Select a Candy Type</Flex>
                </>
              )}
            </Flex>
          </Flex>
        </Container>
      </Modal>
    </Card>
  );
};
