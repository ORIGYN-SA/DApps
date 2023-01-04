import React from 'react';
import { Button, Card, Icons } from '@origyn-sa/origyn-art-ui';

export const MediaList = ({ items, onRemoveClick }: Props) => {
  return items.map((item) => (
    <Card key={item.id} padding="8px" justify="space-between" gap={16}>
      <div>
        <p>Media Type</p>
        <p>{item.type}</p>
      </div>
      <div>
        <p>Name</p>
        <p>{item.path}</p>
      </div>
      <div>
        <p>Pointer</p>
        <p>{item.pointer}</p>
      </div>
      <div>
        <p>Preview</p>
        <p>
          <img height={50} src={item.source} alt="" />
        </p>
      </div>
      <div>
        <p>Actions</p>
        <p>
          <Button type="button" onClick={() => onRemoveClick(item.id)} iconButton>
            <Icons.CloseIcon />
          </Button>
        </p>
      </div>
    </Card>
  ));
};

type Props = {
  items: any;
  onRemoveClick: (id: any) => void;
};
