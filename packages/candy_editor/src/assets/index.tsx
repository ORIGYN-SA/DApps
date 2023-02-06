import React, { useEffect, useState } from 'react';
import { Card, Flex, Grid, Button, HR, Select, Container, Modal } from '@origyn-sa/origyn-art-ui';
import { FormTypes } from './formTypes';
import type { Property, CandyClassEditor, CandyClass, CandyType, EditorMode } from '../types';
import { getValueType } from '../utils/functions';
import { NOT_SELECTED, SELECT_OPTIONS } from '../constants';

export const CandyDataEditor = () => {
  const [candyType, setCandyType] = useState<CandyType>(NOT_SELECTED);
  const [candyClass, setCandyClass] = useState<CandyClass>({ Class: [] });
  const [editableCandyClass, setEditableCandyClass] = useState<CandyClass>({ Class: [] });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('edit');

  const addCandyClassEditor: CandyClassEditor = {
    addPropertyToCandyClass: (property: Property) => {
      setCandyClass({ Class: [...candyClass.Class, property] });
    },
    candyType: candyType,
    editorMode: editorMode,
  };

  const createEditCandyClassEditor = (
    candyType: string,
    property: Property,
    propertyIndex: number,
  ): CandyClassEditor => {
    return {
      candyType: candyType,
      editorMode: editorMode,
      editExistingProperty: (updatedProperty: Property) => {
        const updated = candyClass.Class.map((property, index) => {
          if (index === propertyIndex) {
            return { ...property, ...updatedProperty };
          }
          return property;
        });
        setEditableCandyClass({ Class: updated });
        setCandyClass({ Class: updated });
      },
      removePropertyFromCandyClass: (property: Property): void => {
        const updated = candyClass.Class.filter((item, index) => index !== propertyIndex);
        alert(propertyIndex);
        setEditableCandyClass({ Class: updated });
        console.log('editableCandyClass', editableCandyClass);
        setCandyClass({ Class: updated });
        console.log('candyClass', candyClass)
      },
      property: property,
    };
  };

  const displayModal = (): void => {
    setOpenModal(true);
    setEditorMode('create');
  };

  const closeModal = (): void => {
    setOpenModal(false);
    setCandyType(NOT_SELECTED);
    setEditorMode('edit');
  };

  const handleSelectChange = (candySelectedType: CandyClass): void => {
    setCandyType(candySelectedType);
  };

  const saveCandyClass = (): void => {
    setCandyClass({ Class: [...editableCandyClass.Class] });
  };

  useEffect(() => {
    console.log('Candy Class', candyClass);
    setEditableCandyClass(candyClass);
    setCandyType(NOT_SELECTED);
    closeModal();
  }, [candyClass]);

  return (
    <Card type="outlined" padding="16px">
      <Container>
        <Flex flexFlow="column" gap={16}>
          <Flex>
            <Button size="small" btnType="filled" onClick={displayModal}>
              + Add Candy Value
            </Button>
          </Flex>
          {candyClass.Class.length > 0 ? (
            <>
              <HR marginTop={8} marginBottom={8} />
              <Grid columns={4} gap={16}>
                <Flex>Property Name</Flex>
                <Flex>Property Value</Flex>
                <Flex>Immutable</Flex>
                <Flex>Actions</Flex>
              </Grid>
              <>
                {candyClass.Class.map((property, index) => (
                  <>
                    <Grid columns={4} gap={16}>
                      {FormTypes[getValueType(property).type](
                        createEditCandyClassEditor(getValueType(property).type, property, index),
                      )}
                    </Grid>
                    <HR marginTop={8} marginBottom={8} />
                  </>
                ))}
              </>
              <Flex flexFlow="column" gap={24}>
                <Flex align="flex-end" justify="flex-end">
                  {editableCandyClass === candyClass ? null : (
                    <>
                      <Button size="medium" btnType="filled" onClick={saveCandyClass}>
                        Save Candy Class
                      </Button>
                    </>
                  )}
                </Flex>
              </Flex>
            </>
          ) : null}
        </Flex>
      </Container>
      <Modal closeModal={closeModal} isOpened={openModal} mode="light" size="md">
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
