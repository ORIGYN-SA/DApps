// import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '@dapp/features-authentication';
// import LibraryBox from '../LibraryBox';
// import { getNft } from '@origyn-sa/mintjs';
// import { List, ListItemText, ListItemButton } from '@mui/material';
// import Collapse from '@mui/material/Collapse';
// import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// const LibraryAccordion = () => {
//   const { tokenId, actor } = useContext(AuthContext);
//   const [libData3, setLibData3] = useState([]);
//   const [library3, setLibrary3] = useState();
//   const [openDub, setOpenDub] = useState(false);

//   const handleClick3 = (lib) => {
//     setOpenDub(!open);
//     setLibrary3(lib);
//   };

//   useEffect(() => {
//     if (actor) {
//       getNft(tokenId)
//         .then((r) => {
//           console.log(r);
//           setLibData3(
//             r.ok.metadata.Class.filter((res) => {
//               return res.name === 'library';
//             })[0].value.Array.thawed,
//           );
//           console.log('asta ii Rv', r);
//         })
//         .catch(console.log);
//     }
//   }, [actor]);

//   return (
//     <List sx={{ padding: 0, }}>

//       <Collapse in={openDub} timeout="auto" unmountOnExit>
//         <LibraryBox library3={library3} />
//       </Collapse>
//     </List>
//   );
// };
// export default LibraryAccordion;
