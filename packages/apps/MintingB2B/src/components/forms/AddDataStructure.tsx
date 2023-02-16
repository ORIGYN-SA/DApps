import React, { useState } from 'react'
import { Button, Container, Flex, Icons, Select, TextInput } from '@origyn-sa/origyn-art-ui'
import { genRanHex } from '@dapp/utils'

export const AddDataStructure = ({ handleAdd }) => {
  const [type, setType] = useState({ value: 'text', label: 'Text' })
  const [inputType, setInputType] = useState({ value: 'text', label: 'Text' })
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')

  const addDataField = () => {
    handleAdd({
      name,
      inputType: inputType.value,
      label,
      type: type.value,
    })
  }

  return (
    <Container padding='8px'>
      <Flex gap={8}>
        <div>
          <p>Name</p>
          <p>
            <TextInput
              type='text'
              name='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </p>
        </div>
        <div>
          <p>Label</p>
          <p>
            <TextInput
              name='label'
              type='text'
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </p>
        </div>
        <div>
          <p>Data Type</p>
          <p>
            <Select
              options={[
                { value: 'text', label: 'Text' },
                { value: 'number', label: 'Number' },
              ]}
              selectedOption={type}
              handleChange={setType}
            />
          </p>
        </div>
        <div>
          <p>Input Type</p>
          <p>
            <Select
              options={[
                { value: 'text', label: 'Text' },
                { value: 'number', label: 'Number' },
                { value: 'select', label: 'Select' },
              ]}
              selectedOption={inputType}
              handleChange={setInputType}
            />
          </p>
        </div>
        <div>
          <p></p>
          <Flex>
            <Button type='button' onClick={addDataField} iconButton disabled={!name}>
              <Icons.CloseIcon />
            </Button>
          </Flex>
        </div>
      </Flex>
    </Container>
  )
}
