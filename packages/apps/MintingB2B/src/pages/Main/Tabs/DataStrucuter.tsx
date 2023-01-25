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

  const [type, setType] = useState({ value: 'text', label: 'Text' });
  const [inputType, setInputType] = useState({ value: 'text', label: 'Text' });
  const [name, setName] = useState('');
  const [label, setLabel] = useState({ value: 'label', label: 'Label' });
  const [section, setSection] = useState({value: 'section', label: 'Section'});

  const addDataField = () => {
    addData({
      tTemplate: tTemplate.value,
      sTemplate: sTemplate.value,
      nTemplate,

      section: section.value,
      name,
      inputType: inputType.value,
      label: label.value,
      type: type.value,
    });
  };

  console.log(dataStructure);
  return (
    <>
      <Grid columns={2}>
        <Grid column={1}>
          <StyledSectionTitle className="secondary_color">
            Below you can add or subtract custom fields that are displayed in the Minter's
            Certificate form.
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
            options={[
              { value: 'none', label: 'None' },
              ]}
            selectedOption={sTemplate}
           handleChange={setStemplate}
            />
            <Select 
            name="tTemlate" 
            label="Template type" 
            options={[
              { value: 'none', label: 'None' },
            ]}
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

        <CustomGrid>
          <div>
            <h6>Add new Data Field</h6>
            <br />
            <p className="secondary_color">Add new Data fields to the Minter's Certificate Form</p>
          </div>
          <Flex gap={48} flexFlow="column">
            <Select 
            name="Template" 
            label="Section" 
            options={[
                { value: 'section', label: 'Section' },
              ]}
            selectedOption={section}
            handleChange={setSection}
            />
            <TextInput
              name="name"
              type="type"
              label="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <Select 
            name="label" 
            label="Label" 
            options={[
                { value: 'label', label: 'Label' },
              ]}
            selectedOption={label}
            handleChange={setLabel}
              />
            <Select
              name="type"
              label="Data Type"
              options={[
                { value: 'text', label: 'Text' },
                { value: 'number', label: 'Number' },
              ]}
              selectedOption={type}
              handleChange={setType}
            />
            <Select
              name="inputType"
              label="Input Type"
              options={[
                { value: 'text', label: 'Text' },
                { value: 'number', label: 'Number' },
                { value: 'select', label: 'Select' },
              ]}
              selectedOption={inputType}
              handleChange={setInputType}
            />
            <Flex flexFlow="row">
              <Button btnType="filled" type="button" onClick={addDataField}>
                Submit
              </Button>
            </Flex>
          </Flex>
        </CustomGrid>
        <HR marginTop={48} />
      </Container>

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
