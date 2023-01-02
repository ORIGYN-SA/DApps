import React from 'react';
import { DatePicker, Select, TextArea, TextInput } from '@origyn-sa/origyn-art-ui';

export const Block = (obj) => {
  switch (obj.inputType || obj.type) {
    case 'text':
    case 'number':
      return <TextInput name={obj.name} type={obj.inputType || obj.type} label={obj.label} />;
    case 'date':
      return (
        <DatePicker name={obj.name} label={obj.label} selected={new Date()} onChange={() => {}} />
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
