import React, { useState } from 'react';
import {
  Button,
  Container,
  DatePicker,
  Flex,
  Icons,
  Select,
  TextArea,
} from '@origyn-sa/origyn-art-ui';
import { genRanHex } from '@dapp/utils';

export const AddHistory = ({ handleAdd }) => {
  const [historyType, setHistoryType] = useState<any>({ value: 'appraisal', label: 'Appraisal' });
  const [date, setDate] = useState<any>('');
  const [comment, setComment] = useState('');

  const addHistoryItem = () => {
    const id = genRanHex(32);
    const data = {
      id,
      date: {
        type: 'date',
        value: {
          data: date,
        },
      },
      category: {
        type: 'text',
        value: {
          language: true,
          data: {
            en: historyType.value,
          },
        },
      },
      description: {
        type: 'text',
        value: {
          language: true,
          data: {
            en: comment,
          },
        },
      },
    };
    handleAdd(data);
  };

  return (
    <Container padding="8px">
      <Flex align="center" gap={16} justify="space-between">
        <div>
          <p>Date</p>
          <p>
            <DatePicker selected={date} onChange={setDate} />
          </p>
        </div>
        <div>
          <p>Category</p>
          <p>
            <Select
              options={[
                { value: 'appraisal', label: 'Appraisal' },
                { value: 'service', label: 'Service' },
                { value: 'theft', label: 'Theft' },
              ]}
              selectedOption={historyType}
              handleChange={setHistoryType}
            />
          </p>
        </div>
        <div>
          <p>Comment</p>
          <p>
            <TextArea
              name="comment"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
          </p>
        </div>
        <div>
          <p></p>
          <Flex>
            <Button type="button" onClick={addHistoryItem} iconButton>
              <Icons.CloseIcon />
            </Button>
          </Flex>
        </div>
      </Flex>
    </Container>
  );
};
