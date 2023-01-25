import React, { useState } from 'react';
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
  const [sTemplate, setStemplate] = useState({ value: 'none', label: 'None' });
  const [nTemplate, setNtemplate] = useState('');

  const [openData, setOpenData] = useState(false);
  const handleClose = () => {
    setOpenData(!openData);
  };

  const addDataField = () => {
    addData({
      tTemplate: tTemplate.value,
      sTemplate: sTemplate.value,
      nTemplate,
    });
  };

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
              options={[{ value: 'none', label: 'None' }]}
              selectedOption={sTemplate}
              handleChange={setStemplate}
            />
          </Flex>
        </CustomGrid>
        <HR marginTop={48} marginBottom={48} />

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
              name="tTemlate"
              label="Template type"
              options={[{ value: 'none', label: 'None' }]}
              selectedOption={tTemplate}
              handleChange={setTtemplate}
            />
            <TextInput
              name="nTemplate"
              type="type"
              label="Name Template"
              onChange={(e) => setNtemplate(e.target.value)}
            />
          </Flex>
        </CustomGrid>
        <HR marginTop={48} marginBottom={48} />

        <Flex flexFlow="row" justify="space-between">
          <div>
            <h6>Add New Field</h6>
            <br />
            <p className="secondary_color">Add a new field to this Data Structure</p>
          </div>
          <Button btnType="filled" onClick={()=>setOpenData(!openData)}>Add New Field</Button>
        </Flex>
        <HR marginTop={48} />
      </Container>

      <AddDataModal openConfirmation={openData} handleClose={handleClose} handleAdd={addData} />

      <br />
      <StyledSectionTitle>
        <Flex flexFlow="row" fullWidth={true} justify="space-between">
          <div>
            <h5>Manage Existing Data Fields</h5>
            <br />
            <span className="secondary_color">
              Manually enter grading results found on the IGI diamond report.
            </span>
          </div>
          <div>
            <Flex flexFlow="row" gap={32}>
              <Button btnType="outlined">Save Template</Button>
              <Button btnType="filled">Preview Template</Button>
            </Flex>
          </div>
        </Flex>
      </StyledSectionTitle>
      <br />
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
                      Delete
                    </Button>
                  ),
                };
              })}
            />
            {/* <AddDataStructure handleAdd={addData} /> */}
          </>
        )}
      </Container>
    </>
  );
};

type Props = {
  isLoading: boolean;
  dataStructure: any;
  removeData: any;
  addData: any;
};
