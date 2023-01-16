import React from 'react';
import { Grid, HR } from '@origyn-sa/origyn-art-ui';

export const TextBlocks = ({ data, title }) => {
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>{title}</h2>
      <br />
      {Object.keys(data).map((k, i) => (
        <div key={i}>
          <Grid columns={2}>
            <p>{k.charAt(0).toUpperCase() + k.slice(1)}</p>
            <p style={{ textAlign: 'end' }} className="secondary_color">
              {data[k]?.toString()}
            </p>
          </Grid>
          <HR marginTop={16} />
          <br />
        </div>
      ))}
    </div>
  );
};
