import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import LibraryBox from '../LibraryBox';
//Accordion @MUI
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { TreeItem } from '@mui/lab';

const LibraryAccordion = () => {
  const { tokenId, actor } = useContext(AuthContext);
  const [libData, setLibData] = useState([]);
  const [currentLibrary, setCurrentLibrary] = useState();
  const [expanded, setExpanded] = React.useState<string | false>();

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));

  useEffect(() => {
    if (actor) {
      actor
        .nft_origyn(tokenId)
        .then((r) => {
          console.log(r);
          setLibData(
            r.ok.metadata.Class.filter((res) => {
              return res.name === 'library';
            })[0].value.Array.thawed,
          );
          console.log('R', r);
        })
        .catch(console.log);
    }
  }, [actor]);

  //   return (
  //     <div>
  //       {libData?.map((library) => (
  //         <Accordion
  //           key={library?.Class[0]?.value?.Text}
  //           expanded={expanded === 'panel' + libData.indexOf(library)}
  //           onChange={handleChange('panel' + libData.indexOf(library))}
  //           TransitionProps={{ unmountOnExit: true }}
  //         >
  //           <AccordionSummary
  //             aria-controls="panel1a-content"
  //             id="panel1a-header"
  //             onClick={() => setCurrentLibrary(library)}
  //           >
  //             <Typography>{library?.Class[1]?.value?.Text}</Typography>
  //           </AccordionSummary>
  //           <AccordionDetails>
  //             <LibraryBox currentLibrary={currentLibrary} />
  //           </AccordionDetails>
  //         </Accordion>
  //       ))}
  //     </div>
  //   )
  // }

  return (
    <div>
 
    {libData?.map((library) => (
      
        <TreeItem key={library?.Class[0]?.value?.Text} nodeId={library?.Class[0]?.value?.Text} label={library?.Class[1]?.value?.Text} onClick={() => setCurrentLibrary(library)} >
          <LibraryBox currentLibrary={currentLibrary} />
      </TreeItem>
    ))}
    </div>
  )
}
export default LibraryAccordion;
