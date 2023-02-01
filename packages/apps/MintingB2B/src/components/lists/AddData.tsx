import React, { useEffect, useState } from 'react'
import {
  Container,
  HR,
  Grid,
  Flex,
  Select,
  TextInput,
  Button,
  CustomTable,
  Modal,
  TextArea
} from '@origyn-sa/origyn-art-ui';

const AddDataModal = ({ handleAdd, handleEdit, editData, openConfirmation, handleClose }) => {
  const [type, setType] = useState({ value: 'text', label: 'Text' });
  const [inputType, setInputType] = useState({ value: 'text', label: 'Text' });
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [selectOptions, setSelectOptions] = useState('');
  const [section, setSection] = useState({ value: 'section', label: 'Section' });

  const addDataField = () => {
    if (editData?.name) {
      handleEdit({
        name,
        inputType: inputType.value,
        label: label,
        type: type.value,
        options: selectOptions ? selectOptions.split(',') : undefined,
      })
    } else {
      handleAdd({
        name,
        inputType: inputType.value,
        label: label,
        type: type.value,
        options: selectOptions ? selectOptions.split(',') : undefined,
      })
    }
    closeModal();
  }

  useEffect(() => {
    setType({ value: editData.type || '', label: editData.type || '' });
    setInputType({ value: editData.inputType || '', label: editData.inputType || '' });
    setName(editData.name || '');
    setLabel(editData.label || '');
    setSelectOptions(editData?.options?.join(",") || '');
  }, [editData]);

  const closeModal = () => {
    handleClose(false)
    setType({ value: '', label:'' });
    setInputType({ value: '', label: '' });
    setName('');
    setLabel('');
    setSelectOptions('');
  }

  return (<>
    <Modal isOpened={openConfirmation} closeModal={() => closeModal()} size="md">
      <Container size="full" padding="48px">
        <Flex gap={48} flexFlow="column">
          {/* <Select 
            name="Template" 
            label="Section" 
            options={[
                { value: 'section', label: 'Section' },
              ]}
            selectedOption={section}
            handleChange={setSection}
            /> */}
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
          {inputType.value == 'select' && (
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