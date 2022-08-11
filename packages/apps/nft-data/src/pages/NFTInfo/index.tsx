import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';

import Tabs from '@mui/material/Tabs';
import TreeTab from '../../components/nftTabs/TreeTab';
import RawTab from '../../components/nftTabs/RawTab';
import FormTab from '../../components/nftTabs/FormTab';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import JSONTab from '../../components/nftTabs/JSONTab';

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
        <Box sx={{ /* p: 3 */ }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const NFTInfo = ({metadata}) => {
    const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
    
    return (
      <Container maxWidth="xl" /* size="md" */ /* padding="12px" */>
       {/* <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Raw" value={1} index={0} />
            <Tab label="Table" value={2} index={1} />
            <Tab label="Form" value={3} index={2} />
          </TabList>
        </Box>
        <TabPanel value="1"><RawTab /></TabPanel>
        <TabPanel value="2"><TablesTab /></TabPanel>
        <TabPanel value="3"><FormTab /></TabPanel>
      </TabContext>
    </Box> */}
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Form"  />
          <Tab label="Tree"  />
          <Tab label="Raw"  />
          <Tab label="JSON"  />
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
    </Box>
      </Container>
    );
  };
  
  export default NFTInfo;