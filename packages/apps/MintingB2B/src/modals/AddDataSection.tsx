import React, { useEffect, useState } from 'react'
import {
  Container,
  Flex,
  Select,
  TextInput,
  Button,
  Modal,
} from '@origyn-sa/origyn-art-ui';

const AddDataSection = ({ handleAdd, handleEdit, editData,  isOpened, handleClose }) => {
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');

  const addDataField = () => {
    if (editData?.name) {
      handleEdit(title, subTitle)
    } else {
      handleAdd(title, subTitle)
    }
    closeModal();
  }

  useEffect(() => {
    setTitle(editData.title || '');
    setSubTitle(editData.subTitle || '');
  }, [editData]);

  const closeModal = () => {
    handleClose(false)
    setTitle('');
    setSubTitle('');
  }

  return (<>
    <Modal isOpened={isOpened} closeModal={() => closeModal()} size="md">
      <Container size="full" padding="48px">
        <Flex gap={48} flexFlow="column">
          <TextInput
            name="title"
            type="text"
            label="Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextInput
            name="subTitle"
            type="text"
            label="SubTitle"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
          />
          <Flex flexFlow="row">
            <Button disabled={!title} btnType="filled" type="button" onClick={addDataField}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Modal>
  </>)
}

export default AddDataSection