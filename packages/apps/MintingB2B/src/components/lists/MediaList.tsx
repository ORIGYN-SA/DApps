import React from 'react';
import styled from 'styled-components';
import { Button, Card, Icons } from '@origyn-sa/origyn-art-ui';

const CustomFileUpload = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  position: relative;

  width: 148px;
  height: 148px;
  background: #5F5F5F;
  border-radius: 12px;
  cursor: pointer;

  img {
    width: 148px;
    height: 148px;
    position: absolute;
    border-radius: 12px;
    top: 0;
    left: 0;
  }
`

export const MediaList = ({ items, onRemoveClick }: Props) => {
  return items.map((item) => (
    <CustomFileUpload  key={item.id} align="center" justify="center" gap={16}>
      <img src={item.source} alt="" />
      <Button type="button" onClick={() => onRemoveClick(item.id)} iconButton>
        <Icons.CloseIcon />
      </Button>
    </CustomFileUpload>
  ));
};

type Props = {
  items: any;
  onRemoveClick: (id: any) => void;
};
