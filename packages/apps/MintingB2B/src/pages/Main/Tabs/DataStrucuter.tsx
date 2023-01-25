import React, { useEffect, useState } from 'react';
import {
  Container,
  HR,
  Grid,
  Flex,
  Select,
  TextInput,
  Button,
  CustomTable,
} from '@origyn-sa/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';
import { DataStructureList } from '../../../components/lists/DataStructureList';
import { AddDataStructure } from '../../../components/forms/AddDataStructure';
import styled from 'styled-components';
import { array } from 'yup/lib/locale';
import AddDataModal from './AddData';

const StyledSectionTitle = styled.div`
  margin: 48px 24px;
  width: 70%;
`;

const CustomGrid = styled(Grid)`
  grid-template-columns: 4fr 8fr;
  gap: 120px;
`;

declare type CellType = {
  id: string;
  label: string;
};

export const DataStructure = ({ isLoading, dataStructure, removeData, addData }: Props) => {
  const tableCells: CellType[] = [
    {
      id: 'name',
      label: 'Name',
    },
    {
      id: 'label',
      label: 'Label',
    },
    {
      id: 'type',
      label: 'Type',
    },
    {
      id: 'inputType',
      label: 'Input Type',
    },
    {
      id: 'actions',
      label: 'Actions',
    },
  ];

  const [tTemplate, setTtemplate] = useState({ value: 'none', label: 'None' });
  const [sTemplate, setStemplate] = useState({ value: undefined, label: 'None' });
  const [nTemplate, setNtemplate] = useState('');

  const [openData, setOpenData] = useState(false);
  const handleClose = () => {
    setOpenData(!openData);
  };

  const filter = () => {
    dataStructure.map((data) => {
      selectTemplate.push({ value: data.name, label: data.name });
    });
  };

  const selectTemplate = [{ value: 'newTemplate', label: 'New Template' }];

  const addTemplate = () => {
    selectTemplate.push({ value: nTemplate, label: nTemplate });
  };

  //-------------Testing-----------------

  const arrayData = [];

  const filterData = () => {
    selectTemplate.map((data) => {
      if (data.value == sTemplate.value) {
        arrayData.push(data);
      }
    });
  };

  console.log(arrayData); // this will filter the data showed for each

  //----------------------------------------

  useEffect(() => {
    filter();
    filterData();
    console.log(arrayData);
  }, [selectTemplate, addTemplate, setStemplate]);

  console.log(dataStructure);
  return (
    <>
      <Grid columns={2}>
        <Grid column={1}>
          <StyledSectionTitle>
            <h2>Create/Edit Data Structure</h2>
            <br />
            <p className="secondary_color">
              Below you can add or subtract custom fields that are displayed in the Minter's
              Certificate form.
            </p>
          </StyledSectionTitle>
        </Grid>
      </Grid>
      <HR marginBottom={24} />
      <Container padding="24px">
        <CustomGrid>
          <div>
            <h6>Select Template Type</h6>
            <br />
            <p className="secondary_color">
              Select from our predefined templates or build your own based on the project you are
              creating certificates for.
            </p>
          </div>
          <Flex gap={48} flexFlow="column">
            <Select
              name="sTemplate"
              label="Select Template"
              options={selectTemplate}
              selectedOption={sTemplate}
              handleChange={setStemplate}
            />
          </Flex>
        </CustomGrid>
      </Container>
      <HR marginTop={48} marginBottom={48} />

      {sTemplate.value != undefined &&
        (sTemplate.value == 'newTemplate' ? (
          <>
            <Container padding="24px">
              <CustomGrid>
                <div>
                  <h6>Set Template Type</h6>
                  <br />
                  <p className="secondary_color">
                    Select from our predefined templates or build your own based on the project you
                    are creating certificates for.
                  </p>
                </div>
                <Flex gap={48} flexFlow="column">
                  <TextInput
                    name="nTemplate"
                    type="type"
                    label="Name Template"
                    onChange={(e) => setNtemplate(e.target.value)}
                  />
                  <Select
                    name="tTemlate"
                    label="Template type"
                    options={[
                      { value: 'none', label: 'None' },
                      { value: 'test', label: 'Test' },
                    ]}
                    selectedOption={tTemplate}
                    handleChange={setTtemplate}
                  />
                </Flex>
              </CustomGrid>
            </Container>
            <HR marginTop={48} marginBottom={48} />
            <Container padding="24px">
              <Flex flexFlow="row" justify="space-between">
                <div>
                  <h6>Add New Field</h6>
                  <br />
                  <p className="secondary_color">Add a new field to this Data Structure</p>
                </div>
                <Button btnType="filled" onClick={() => setOpenData(!openData)}>
                  Add New Field
                </Button>
              </Flex>
            </Container>
            <HR marginTop={48} marginBottom={48} />
            <Container padding="0px 24px 24px 24px">
              {isLoading ? (
                <LoadingContainer />
              ) : (
                <>
                  <CustomTable
                    cells={tableCells}
                    rows={dataStructure.map((row) => {
                      return {
                        name: row.name,
                        label: row.label,
                        type: row.type,
                        inputType: row.inputType,
                        actions: (
                          <Button btnType="filled" onClick={removeData}>
                            Edit/Delete
                          </Button>
                        ),
                      };
                    })}
                  />
                </>
              )}
            </Container>

            <HR marginBottom={24} />
            <Container padding="24px">
              <Flex flexFlow="row" justify="space-between">
                <div>
                  <h6>Save Template</h6>
                  <br />
                  <p className="secondary_color">Save your progress</p>
                </div>
                <Button btnType="filled" onClick={() => addTemplate()}>
                  Save Template
                </Button>
              </Flex>
            </Container>
            <HR marginTop={24} />
          </>
        ) : (
          <div>
            <>
              <Container padding="24px">
                <Flex flexFlow="row" justify="space-between">
                  <div>
                    <h6>Add New Field</h6>
                    <br />
                    <p className="secondary_color">Add a new field to this Data Structure</p>
                  </div>
                  <Button btnType="filled" onClick={() => setOpenData(!openData)}>
                    Add New Field
                  </Button>
                </Flex>
              </Container>
              <HR marginTop={48} marginBottom={48} />

              <Container padding="0px 24px 24px 24px">
                {isLoading ? (
                  <LoadingContainer />
                ) : (
                  <>
                    <CustomTable
                      cells={tableCells}
                      rows={dataStructure.map((row) => {
                        return {
                          name: row.name,
                          label: row.label,
                          type: row.type,
                          inputType: row.inputType,
                          actions: (
                            <Button btnType="filled" onClick={removeData}>
                              Edit/Delete
                            </Button>
                          ),
                        };
                      })}
                    />
                  </>
                )}
              </Container>

              <HR marginBottom={24} />
              <Container padding="24px">
                <Flex flexFlow="row" justify="space-between">
                  <div>
                    <h6>Save Template</h6>
                    <br />
                    <p className="secondary_color">Save your progress</p>
                  </div>
                  <Button btnType="filled" onClick={() => addTemplate()}>
                    Save Template
                  </Button>
                </Flex>
              </Container>
              <HR marginTop={24} />
            </>
          </div>
        ))}

      <AddDataModal openConfirmation={openData} handleClose={handleClose} handleAdd={addData} />
    </>
  );
};

type Props = {
  isLoading: boolean;
  dataStructure: any;
  removeData: any;
  addData: any;
};
