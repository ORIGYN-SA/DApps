import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';

import Tabs from '@mui/material/Tabs';
import TreeTab from '../../components/nftTabs/TreeTab';
import RawTab from '../../components/nftTabs/RawTab';
import FormTab from '../../components/nftTabs/FormTab';
import NewForm from '../../components/nftTabs/NewForm';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import JSONTab from '../../components/nftTabs/JSONTab';
import NewForm from '../../components/nftTabs/NewForm';
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

<<<<<<< HEAD
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Form"  />
          <Tab label="Tree"  />
          <Tab label="Raw"  />
          <Tab label="JSON"  />
          <Tab label="Update" disabled={true} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
      <FormTab metadata={metadata} />
      </TabPanel>
      <TabPanel value={value} index={1}>
      <TreeTab metadata={metadata} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RawTab metadata={metadata} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <JSONTab metadata={metadata} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <NewForm metadata={metadata} />
      </TabPanel>
    </Box>
      </Container>
    );
  };
  
  export default NFTInfo;
=======
  return (
    <Container maxWidth="xl">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Form" />
            <Tab label="Tree" />
            <Tab label="Raw" />
            <Tab label="JSON" />
            <Tab label="NEW FORM" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <FormTab metadata={metadata} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TreeTab metadata={metadata} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <RawTab metadata={metadata} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <JSONTab metadata={metadata} />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <NewForm metadata={metadata} />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default NFTInfo;
>>>>>>> main
