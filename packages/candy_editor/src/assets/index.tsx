import React, { useContext, useEffect, useState } from 'react';
import { Card, Flex, Button, HR, Select, Container } from '@origyn-sa/origyn-art-ui';
import type { CandyValue } from '../types';

export const CandyDataEditor = () => {
  const selectOptions = [{ label: 'Text', value: 'Text' }];
  const [openForm, setOpenForm] = React.useState(false);
  const [candyType, setCandyType] = useState<string>('Not selected');
  const handleOpenForm = () => {
    setOpenForm(!openForm);
  };
  const handleSelectChange = (type) => {
    setCandyType(type);
  };

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
              <Flex flexFlow="row">
                <Flex>
                  <Select
                    label="Candy Type"
                    handleChange={(type) => {
                      handleSelectChange(type.value);
                    }}
                    options={selectOptions.map((option) => ({
                      label: option.label,
                      value: option.value,
                    }))}
                  />
                </Flex>
              </Flex>
            </>
          ) : null}
        </Flex>
      </Container>
    </Card>
  );
};
