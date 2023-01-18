import React from 'react';
import { DatePicker, Select, TextArea, TextInput, Grid, Flex, HR } from '@origyn-sa/origyn-art-ui';
import styled from 'styled-components';

const CustomGrid = styled(Grid)`
  grid-template-columns: 4fr 8fr;
`

export const Block = (obj) => {
  switch (obj.inputType || obj.type) {
    case 'category':
      return <div>
        <CustomGrid>
          <div>
            <h6>{obj?.title}</h6>
            <p>{obj?.subTitle}</p>
          </div>
          <Flex gap={48} flexFlow="column">
            {
              obj.fields.map((f) => {
                return <Block {...f} />  
              })
            }
          </Flex>
      </CustomGrid>
      <HR marginTop={48} marginBottom={48} />
    </div>;
    case 'text':
    case 'number':
      return <TextInput name={obj.name} type={obj.inputType || obj.type} label={obj.label} />;
    case 'date':
      return (
        <DatePicker name={obj.name} label={obj.label} selected={new Date()} onChange={() => {}} />
      );
    case 'file':
      return (
        <input type="file" />
      );
    case 'select':
      return (
        <Select
          name={obj.name}
          label={obj.label}
          options={obj.options.map((v) => ({ value: v, label: v }))}
        />
      );
    case 'largeText':
      return <TextArea name={obj.name} label={obj.label} />;
    default:
      return <div></div>;
  }
};
