import React, { useEffect, useState } from 'react';
import {
  Container,
  HR,
  Grid,
  Flex,
  Button,
  CustomTable,
} from '@origyn-sa/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';
import styled from 'styled-components';
import AddDataModal from '../../../components/lists/AddData';

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
  canSort?: boolean;
};

export const DataStructure = ({ isLoading, dataStructure, removeData, addData }: Props) => {
  const [editData, setEditData] = useState({});
  const tableCells: CellType[] = [
    {
      id: 'name',
      label: 'Name',
      canSort: true,
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

  const [openData, setOpenData] = useState(false);
  const handleClose = () => {
    setOpenData(!openData);
    setEditData({});
  };
  const editField = (data) => {
    setEditData(data);
    setOpenData(true);
  };

  const handleEdit = (data) => {
    removeData(data.name);
    addData(data);
  }

  console.log(dataStructure);
  return (
    <>
      <Grid columns={2}>
        <Grid column={1}>
          <StyledSectionTitle>
            <h2>Create/Edit Data Structure</h2>
            <p className="secondary_color">
              Below you can add or subtract custom fields that are displayed in the Minter's
              Certificate form.
            </p>
          </StyledSectionTitle>
        </Grid>
      </Grid>

      <HR marginTop={24} marginBottom={48} />
      <Container padding="24px">
        <Flex flexFlow="row" justify="space-between">
          <div>
            <h6>Add New Field</h6>
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
                    <Flex gap={8}>
                      <Button size="small" btnType="filled" onClick={() => editField(row)}>
                        Edit
                      </Button>
                      <Button size="small" btnType="filled" onClick={() => removeData(row.name)}>
                        Delete
                      </Button>
                    </Flex>
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
            <p className="secondary_color">Save your progress</p>
          </div>
          <Button btnType="filled">
            Save Template
          </Button>
        </Flex>
      </Container>
      <HR marginTop={24} />

      <AddDataModal
        openConfirmation={openData}
        editData={editData}
        handleClose={handleClose}
        handleAdd={addData}
        handleEdit={handleEdit}
      />
    </>
  );
};

type Props = {
  isLoading: boolean;
  dataStructure: any;
  removeData: any;
  addData: any;
};
