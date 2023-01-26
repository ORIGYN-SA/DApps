import React, {useState} from 'react'
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

  const AddDataModal = ({ handleAdd, openConfirmation, handleClose }) => {
    const [type, setType] = useState({ value: 'text', label: 'Text' });
    const [inputType, setInputType] = useState({ value: 'text', label: 'Text' });
    const [name, setName] = useState('');
    const [label, setLabel] = useState('');
    const [section, setSection] = useState({value: 'section', label: 'Section'});

    const addDataField = () => {
        handleAdd({
            section: section.value,
            name,
            inputType: inputType.value,
            label: label,
            type: type.value,
        })
        handleClose();
      }

    return(<>
          <Modal isOpened={openConfirmation} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
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
            <TextInput
              name="label" 
              label="Label" 
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
            {inputType.value == 'select' && (
            <>
              <TextInput
                name="name"
                type="type"
                label="Input Option 1"
              />
              <TextInput
                name="name"
                label="Input Option 2"
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