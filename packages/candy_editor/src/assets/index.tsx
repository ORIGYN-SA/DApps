import React, { useEffect, useState } from 'react';
import { Card, Flex, Button, HR, Select, Container, Modal } from '@origyn-sa/origyn-art-ui';
import { FormTypes } from './formTypes';
import type { Property, CandyClassEditor, CandyClass, CandyType, EditorMode } from '../types';
import { getValueType } from '../utils/functions';
import { NOT_SELECTED, SELECT_OPTIONS } from '../constants';

export const CandyDataEditor = () => {
  const [candyType, setCandyType] = useState<CandyType>(NOT_SELECTED);
  const [candyClass, setCandyClass] = useState<CandyClass>({ Class: [] });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<EditorMode>("edit");

  const addCandyClassEditor: CandyClassEditor = {
    addPropertyToCandyClass: (property: Property) => {
      setCandyClass({ Class: [...candyClass.Class, property] });
    },
    candyType: candyType,
    removePropertyFromCandyClass: (property: Property): void => {
      const newClass = [...candyClass.Class];
      const index = newClass.indexOf(property);
      if (index !== -1) {
        newClass.splice(index, 1);
      }
      setCandyClass({ Class: newClass });
    },
    editorMode: editorMode,
  };

  const createEditCandyClassEditor = (candyType: string, property: Property, propIndex: number): CandyClassEditor => {
    return {
      candyType: candyType,
      editorMode: editorMode,
      editExistingProperty: (updatedProperty: Property,) => {
        const updatedProperties = candyClass.Class.map((property, index) => {
          if (index === propIndex) {
            return { ...property, ...updatedProperty };
          }
          return property;
        });
        setCandyClass({ Class: updatedProperties });
      },
      property: property
    }
  }

  const displayModal = () => {
    setOpenModal(true);
    setEditorMode("create")
  };

  const closeModal = () => {
    setOpenModal(false);
    setCandyType(NOT_SELECTED);
    setEditorMode("edit")
  };

  const handleSelectChange = (candySelectedType: CandyClass) => {
    setCandyType(candySelectedType);
  };

  useEffect(() => {
    console.log('Candy Class', candyClass);
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
              <Flex flexFlow="column" gap={24}>
                {
                  candyClass.Class.map((property, index) => (
                    <Flex flexFlow="row" gap={24} key={index}>
                      {
                        FormTypes[getValueType(property).type](
                          createEditCandyClassEditor(getValueType(property).type, property, index)
                        )
                      }
                    </Flex>
                  ))
                }
              </Flex>
            </>
          ) : null}
        </Flex>
      </Container>
      <Modal closeModal={closeModal} isOpened={openModal} mode="light" size="md">
        <Container padding="16px">
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
            <HR marginTop={8} marginBottom={8} />
            <Flex flexFlow="column" gap={16}>
              {candyType !== null ? (
                FormTypes[candyType.toString()](addCandyClassEditor)
              ) : (
                <>
                  <Flex>Select a Candy Type</Flex>
                  <HR marginTop={8} marginBottom={16} />
                </>
              )}
            </Flex>
          </Flex>
        </Container>
      </Modal>
    </Card>
  );
};
