import React from 'react';
import { Container, HR, Grid, Flex, Select, TextInput, Button } from '@origyn-sa/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';
import { DataStructureList } from '../../../components/lists/DataStructureList'
import { AddDataStructure } from '../../../components/forms/AddDataStructure'
import styled from 'styled-components'

export const DataStructure = ({ isLoading, dataStructure, removeData, addData }: Props) => {

  const StyledSectionTitle = styled.div`
  margin: 48px 24px;
`

const CustomGrid = styled(Grid)`
  grid-template-columns: 4fr 8fr;
  gap: 120px;
`

  console.log(dataStructure)
  return (
    <>
    <Grid columns={2}>
      <Grid column={1}>
    <StyledSectionTitle>Below you can add or subtract custom fields that are displayed in the Minter's Certificate form.</StyledSectionTitle>
    </Grid>
    </Grid>
      <HR marginBottom={32}/>
    <Container padding="16px">
    <CustomGrid>
          <div>
            <h6>Select Template Type</h6>
            <br/>
            <p>Select from our predefined templates or 
              build your own based on the project you are 
              creating certificates for.</p>
          </div>
          <Flex gap={48} flexFlow="column">
          <Select
          name="Template"
          label="Select Template"
        />
        <Select
          name="Type"
          label="Template type"
        />
        <TextInput name="Name Template" type="type" label="Name Template" />
          </Flex>
      </CustomGrid>
      <HR marginTop={48} marginBottom={48} />

      <CustomGrid>
          <div>
            <h6>Add new Data Field</h6>
            <p>Add new Data fields to the Minter's Certificate Form</p>
          </div>
          <Flex gap={48} flexFlow="column">
          <Select
          name="Template"
          label="Section"
        />
        <TextInput name="Name Template" type="type" label="Name" />
        <Select
          name="Type"
          label="Label"
        />
        <Select
          name="Type"
          label="Data Type"
        />
                <Select
          name="Type"
          label="Input Type"
        />
        <Flex flexFlow="row">
        <Button btnType="filled" type="submit">Submit</Button>
        </Flex>
          </Flex>
      </CustomGrid>
      <HR marginTop={48} />
     
      </Container>
      
      <br />
      <StyledSectionTitle>
        <Flex flexFlow='row' justify='space-between'>
          <div>
        <h5>Manage Existing Data Fields</h5>
        <span>Manually enter grading results found on the IGI diamond report.</span>
        </div>
        <Flex flexFlow='row' gap={32}>
        <Button btnType="outlined">Save Template</Button>
        <Button btnType="filled" >Preview Template</Button>
        </Flex>
        </Flex>
        </StyledSectionTitle>
      <br />
      <Container padding="16px">
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <>
          <DataStructureList
            key="3"
            items={dataStructure}
            onRemoveClick={removeData}
          />
          <AddDataStructure
            handleAdd={addData}
          />
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
