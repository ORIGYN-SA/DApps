import React, { useEffect, useState } from 'react';
import { Card, Flex, Button, HR, Select, Container } from '@origyn-sa/origyn-art-ui';
import { FormTypes } from './formTypes';
import type { Property, CandyClassEditor, CandyClass } from '../types';
import { NOT_SELECTED } from '../constants';

export const CandyDataEditor = () => {
  const selectOptions = [{ label: 'Text', value: 'Text' }];
  const [openForm, setOpenForm] = React.useState(false);
  const [candyType, setCandyType] = useState<string>(NOT_SELECTED);
  const [candyClass, setCandyClass] = useState<CandyClass>({ Class: [] });

  const candyClassEditor: CandyClassEditor = {
    addPropertyToCandyClass: (property: Property) => {
      setCandyClass({ Class: [...candyClass.Class, property] });
    },
  };

  const handleOpenForm = () => {
    setOpenForm(!openForm);
  };
  const handleSelectChange = (candySelectedType: string) => {
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
            <Button size="small" btnType="filled" onClick={handleOpenForm}>
              + Add Candy Value
            </Button>
          </Flex>
          {openForm ? (
            <>
              <HR marginTop={8} marginBottom={8} />
              <Flex flexFlow="column" gap={16}>
                <Flex>
                  <Select
                    inputSize="medium"
                    label="Select Candy Type"
                    handleChange={(type) => {
                      handleSelectChange(type.value);
                    }}
                    options={selectOptions.map((option) => ({
                      label: option.label,
                      value: option.value,
                    }))}
                  />
                </Flex>
                <HR marginTop={8} marginBottom={8} />
                <Flex>
                  {candyType !== 'Not selected' ? FormTypes[candyType](candyClassEditor) : null}
                </Flex>
              </Flex>
            </>
          ) : null}
          {candyClass['Class'].length > 0 ? (
            <>
              <HR marginTop={8} marginBottom={8} />
              <Flex>
                <b>Your Candy Class: </b> <pre>{JSON.stringify(candyClass, null, 2)}</pre>
              </Flex>
            </>
          ) : null}
        </Flex>
      </Container>
    </Card>
  );
};
