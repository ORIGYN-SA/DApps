import React from 'react';
import { Button, Container, Flex, Icons } from '@origyn-sa/origyn-art-ui';

export const HistoryList = ({ items, onRemoveClick }: Props) => {
  return items.map((item) => {
    return (
      <Container padding="8px" key={item?.description?.value?.data?.e}>
        <Flex justify="space-between" gap={16}>
          <div>
            <p>Date</p>
            <p>{item.date?.value?.data.toString()}</p>
          </div>
          <div>
            <p>Category</p>
            <p>{item?.category?.value?.data?.en}</p>
          </div>
          <div>
            <p>Description</p>
            <p>{item?.description?.value?.data?.en}</p>
          </div>
          <div>
            <p>Actions</p>
            <p>
              <Button type="button" onClick={() => onRemoveClick(item.id)} iconButton>
                <Icons.CloseIcon />
              </Button>
            </p>
          </div>
        </Flex>
      </Container>
    );
  });
};

type Props = {
  items: any;
  onRemoveClick: (id: any) => void;
};
