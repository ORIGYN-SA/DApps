import React from 'react';
import { Container } from '@origyn-sa/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';
import { DataStructureList } from '../../../components/lists/DataStructureList'
import { AddDataStructure } from '../../../components/forms/AddDataStructure'

export const DataStructure = ({ isLoading, dataStructure, removeData, addData }: Props) => {
  console.log(dataStructure)
  return (
    <Container padding="16px">
      <br />
      <h2>Change Certificate Data structure</h2>
      <br />
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
  );
};

type Props = {
  isLoading: boolean;
  dataStructure: any;
  removeData: any;
  addData: any;
};
