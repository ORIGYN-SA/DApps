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
    Modal
  } from '@origyn-sa/origyn-art-ui';

  const AddDataModal = ({ handleAdd, openConfirmation, handleClose }) => {
    const [type, setType] = useState({ value: 'text', label: 'Text' });
    const [inputType, setInputType] = useState({ value: 'text', label: 'Text' });
    const [name, setName] = useState('');
    const [label, setLabel] = useState({ value: 'label', label: 'Label' });
    const [section, setSection] = useState({value: 'section', label: 'Section'});

    const addDataField = () => {
        handleAdd({
            section: section.value,
            name,
            inputType: inputType.value,
            label: label.value,
            type: type.value,
        })
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
        </Container>
        </Modal>
    </>)
  }

  export default AddDataModal