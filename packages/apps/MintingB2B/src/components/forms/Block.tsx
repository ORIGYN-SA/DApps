import React from 'react';
import { DatePicker, Select, TextArea, TextInput, Grid, Flex, HR } from '@origyn-sa/origyn-art-ui';
import styled from 'styled-components';
import { AddFile } from './AddFile';
import { MediaList } from '../lists';
import { useState } from 'react';
import { FilesList } from '../lists/FilesList';

const CustomGrid = styled(Grid)`
  grid-template-columns: 4fr 8fr;
  gap: 16px;
`

const ImageField = ({ obj, addFile, removeFile }) => {
  const [files, setFiles] = useState([]);

  const handleAddFile = async (file) => {
    const f = await addFile(file);
    console.log(f);
    setFiles(f);
  }

  const handleRemoveFiles = (fileId) => {
    setFiles(files.filter(({ id }) => id !== fileId));
    removeFile(fileId);
  };

  return (
    <Flex gap={32} flexFlow="column">
      <div>
        <p><b>{obj?.label}</b></p>
        <p>{obj?.subLabel}</p>
      </div>
      <Flex gap={48}>
        <MediaList
          items={files.filter(({ pointer }) => pointer === obj.pointer)}
          onRemoveClick={handleRemoveFiles}
        />
        <AddFile handleAdd={handleAddFile} pointer={obj.pointer} />
      </Flex>
    </Flex>
  )
}

const FilesField = ({ obj, addFile, removeFile }) => {
  const [files, setFiles] = useState([]);

  const handleAddFile = async (file) => {
    const f = await addFile(file);
    console.log(f);
    setFiles(f);
  }

  const handleRemoveFiles = (fileId) => {
    setFiles(files.filter(({ id }) => id !== fileId));
    removeFile(fileId);
  };

  return (
    <Flex gap={32} flexFlow="column">
      <div>
        <p><b>{obj?.label}</b></p>
        <p>{obj?.subLabel}</p>
      </div>
      <Grid columns={2} gap={48}>
        <FilesList
            items={files.filter(({ pointer }) => pointer === obj.pointer)}
            onRemoveClick={handleRemoveFiles}
        />
      </Grid>
      <Flex gap={48}>
        <AddFile handleAdd={handleAddFile} pointer={obj.pointer} />
      </Flex>
    </Flex>
  )
}

export const Block = ({addFile, removeFile, ...obj}) => {
  switch (obj.inputType || obj.type) {
    case 'category':
      return <div>
        <CustomGrid>
          <div>
            <h6>{obj?.title}</h6>
            <p>{obj?.subTitle}</p>
          </div>
          <Flex gap={48} flexFlow="column">
            {
              obj.fields.map((f) => {
                return <Block removeFile={removeFile} addFile={addFile} {...f} />
              })
            }
          </Flex>
        </CustomGrid>
        <HR marginTop={48} marginBottom={48} />
      </div>;
    case 'text':
    case 'number':
      return <TextInput name={obj.name} type={obj.inputType || obj.type} label={obj.label} />;
    case 'date':
      return (
        <DatePicker name={obj.name} label={obj.label} selected={new Date()} onChange={() => { }} />
      );
    case 'files':
      console.log("FILES");
      return (
        <FilesField
          addFile={addFile}
          removeFile={removeFile}
          obj={obj}
        />
      );
    case 'images':
      return (
        <ImageField
          addFile={addFile}
          removeFile={removeFile}
          obj={obj}
        />
      );
    case 'select':
      return (
        <Select
          name={obj.name}
          label={obj.label}
          options={obj.options.map((v) => ({ value: v, label: v }))}
        />
      );
    case 'largeText':
      return <TextArea name={obj.name} label={obj.label} />;
    default:
      return <div></div>;
  }
};
