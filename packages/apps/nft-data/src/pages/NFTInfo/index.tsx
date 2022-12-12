import * as React from 'react';
import Box from '@mui/material/Box';
import TreeTab from '../../components/nftTabs/TreeTab';
import RawTab from '../../components/nftTabs/RawTab';
import FormTab from '../../components/nftTabs/FormTab';
import Typography from '@mui/material/Typography';
import JSONTab from '../../components/nftTabs/JSONTab';
import { SecondaryNav } from '@origyn-sa/origyn-art-ui';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const NFTInfo = ({ metadata }: any) => {
  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <SecondaryNav
        title="NFT Data"
        tabs={[
          { title: 'Form', id: 'Form' },
          { title: 'Tree', id: 'Tree' },
          { title: 'Raw', id: 'Raw' },
          { title: 'JSON', id: 'JSON' },
        ]}
        content={[
          <FormTab metadata={metadata} />,
          <TreeTab metadata={metadata} />,
          <RawTab metadata={metadata} />,
          <JSONTab metadata={metadata} />,
        ]}
      />
    </>
  );
};

export default NFTInfo;
