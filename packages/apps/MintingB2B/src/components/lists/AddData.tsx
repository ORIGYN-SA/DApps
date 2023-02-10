import React, { useEffect, useState } from 'react'
import {
  Container,
  Flex,
  Select,
  TextInput,
  Button,
  Modal,
} from '@origyn-sa/origyn-art-ui';

const AddDataModal = ({ handleAdd, handleEdit, editData, openConfirmation, handleClose, sections }) => {
  const [type, setType] = useState({ value: 'text', label: 'Text' });
  const [inputType, setInputType] = useState({ value: 'text', label: 'Text' });
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [selectOptions, setSelectOptions] = useState('');
  const [pointer, setPointer] = useState('');
  const [section, setSection] = useState({value: "", label: ""});

  const addDataField = () => {
    if (editData?.name) {
      handleEdit({
        name,
        inputType: inputType.value,
        label: label,
        type: inputType.value === "images" || inputType.value === "files" ? "files" : type.value,
        options: selectOptions ? selectOptions.split(',') : undefined,
        pointer,
      }, section?.value)
    } else {
      handleAdd({
        name,
        inputType: inputType.value,
        label: label,
        type: inputType.value === "images" || inputType.value === "files" ? "files" : type.value,
        options: selectOptions ? selectOptions.split(',') : undefined,
        pointer,
      }, section?.value);
    }
    closeModal();
  }

  useEffect(() => {
    setType({ value: editData.type || '', label: editData.type || '' });
    setInputType({ value: editData.inputType || '', label: editData.inputType || '' });
    setName(editData.name || '');
    setLabel(editData.label || '');
    setPointer(editData.pointer || '');
    setSelectOptions(editData?.options?.join(",") || '');
  }, [editData]);

  const closeModal = () => {
    handleClose(false)
    setType({ value: '', label:'' });
    setInputType({ value: '', label: '' });
    setName('');
    setLabel('');
    setSelectOptions('');
    setPointer('');
    setSection(undefined);
  }

  return (<>
    <Modal isOpened={openConfirmation} closeModal={() => closeModal()} size="md">
      <Container size="full" padding="48px">
        <Flex gap={48} flexFlow="column">
          <Select 
            name="section"
            label="Section"
            options={sections?.map((f) => ({value: f, label: f}))}
            selectedOption={section}
            handleChange={setSection}
            />
          <Select
            name="inputType"
            label="Input Type"
            options={[
              { value: 'text', label: 'Text' },
              { value: 'number', label: 'Number' },
              { value: 'select', label: 'Select' },
              { value: 'images', label: 'Images' },
              { value: 'files', label: 'Files' },
            ]}
            selectedOption={inputType}
            handleChange={setInputType}
          />
          <TextInput
            name="name"
            type="text"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={editData?.name}
          />
          <TextInput
            name="label"
            label="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          {
            inputType.value !== 'files' && inputType.value !== 'images' && (
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
            )
          }
          {
            (inputType.value === 'files' || inputType.value === 'images') && (
              <TextInput
                name="pointer"
                type="text"
                label="Pointer (use files-***)"
                value={pointer}
                onChange={(e) => setPointer(e.target.value)}
              />
            )
          }
          {inputType.value === 'select' && (
            <>
              <TextInput
                name="options"
                type="text"
                label="Input Options (`,` as separator)"
                value={selectOptions}
                onChange={(e) => setSelectOptions(e.target.value)}
              />
            </>
          )}
          <Flex flexFlow="row">
            <Button btnType="filled" type="button" onClick={addDataField}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Modal>
  </>)
}

export default AddDataModal