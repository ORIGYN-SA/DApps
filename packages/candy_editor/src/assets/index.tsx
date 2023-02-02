import React, { useEffect, useState } from 'react';
import { Card, Flex, Button, HR, Select, Container, Modal } from '@origyn-sa/origyn-art-ui';
import { FormTypes } from './formTypes';
import type { Property, CandyClassEditor, CandyClass, CandyType } from '../types';
import { NOT_SELECTED, SELECT_OPTIONS } from '../constants';

export const CandyDataEditor = () => {
  const [candyType, setCandyType] = useState<CandyType>(NOT_SELECTED);
  const [candyClass, setCandyClass] = useState<CandyClass>({ Class: [] });
  const [openModal, setOpenModal] = useState<boolean>(false);

  const removePropertyFromCandyClass = (property: Property): void => {
    const newClass = [...candyClass.Class];
    const index = newClass.indexOf(property);
    if (index !== -1) {
      newClass.splice(index, 1);
    }
    setCandyClass({ Class: newClass });
  };

  const candyClassEditor: CandyClassEditor = {
    addPropertyToCandyClass: (property: Property) => {
      setCandyClass({ Class: [...candyClass.Class, property] });
    },
    candyType: candyType,
  };

  const displayModal = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleSelectChange = (candySelectedType: CandyClass) => {
    setCandyType(candySelectedType);
  };

  useEffect(() => {
    console.log('Candy Class', candyClass);
    setCandyType(NOT_SELECTED);
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
              <Flex flexFlow="column" gap={16}>
                {candyClass.Class.map((property, index) => (
                  <Flex key={index} flexFlow="row" gap={8}>
                    <Flex>
                      <p>
                        <b>Name: </b>
                        {property.name}
                      </p>
                    </Flex>
                    <Flex>
                      <p>
                        <b>Value: </b>
                        {Object.getOwnPropertyNames(property.value)[0].toString()}
                      </p>
                    </Flex>
                    <Flex>
                      <p>
                        <b>Immutable: </b>
                        {property.immutable.toString()}
                      </p>
                    </Flex>
                    <Flex justify="flex-end" align="flex-end">
                      <Button
                        size="small"
                        btnType="filled"
                        onClick={() => removePropertyFromCandyClass(property)}
                      >
                        Remove
                      </Button>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </>
          ) : null}
        </Flex>
      </Container>
      <Modal
        closeModal={closeModal}
        isOpened={openModal}
        mode="light"
        size="md"
      >
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
            <Flex>
              {candyType !== null
                ? FormTypes[candyType.toString()](candyClassEditor, candyType)
                : <>
                  <Flex>Select a Candy Type</Flex>
                  <HR marginTop={8} marginBottom={16} />
                </>}
            </Flex>
          </Flex>
        </Container>
      </Modal>
    </Card>

  );
};
