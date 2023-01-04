import React from 'react'
import { Button, Container, Flex, Grid, HR, Icons } from '@origyn-sa/origyn-art-ui'

export const DataStructureList = ({ items, onRemoveClick }: Props) => {
  return (
    <Flex fullWidth flexFlow='column' gap={8}>
      {
        items?.map((dataItem) => {
          return (
            <>
              <Grid columns={5} smColumns={5}>
                <div>
                  <p className='secondary_color'>Name</p>
                  <p>{dataItem.name}</p>
                </div>
                <div>
                  <p className='secondary_color'>Label</p>
                  <p>{dataItem.label}</p>
                </div>
                <div>
                  <p className='secondary_color'>Type</p>
                  <p>{dataItem.type}</p>
                </div>
                <div>
                  <p className='secondary_color'>Input Type</p>
                  <p>{dataItem.inputType}</p>
                </div>
                <div>
                  <p className='secondary_color'>Actions</p>
                  <p><Button btnType='filled' size='small' onClick={() => onRemoveClick(dataItem.name)}>Remove
                    Field</Button></p>
                </div>
              </Grid>
              <HR />
            </>
          )
        })
      }
    </Flex>
  )
}

type Props = {
  items: any;
  onRemoveClick: (id: any) => void;
};
