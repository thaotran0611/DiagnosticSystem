// import './Sidebar.css';
// import {SidebarData} from './SidebarData.js'
// import { useNavigate } from 'react-router-dom';

// function SideBar(){
//   const navigate = useNavigate();
//   return <div id='sidebar'> <ul class ="SidebarList">
//     {SidebarData.map((val,key) => {
//       return (
//         <li key={key} class="row" onClick={()=> {navigate(val.link)}}> 
//           {" "}
//           <div id="icon"> {val.icon}</div> {" "}
//           <div id="title"> 
//             {val.title}
//           </div>
//         </li>
//         );
//     })}
//     </ul>
//   </div>;
// }
// export default SideBar;

import React, { useState } from 'react';
import { Box, Stack, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Grid, GridItem } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { SidebarData } from './SidebarData.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretLeft, faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
  <IconButton bg={'none'} boxSize={5} icon={<FontAwesomeIcon icon={faBars} />} aria-label="Open Sidebar" onClick={onOpen} />

      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
        <DrawerOverlay>
          <DrawerContent>
          <Box as="button" onClick={onClose} position="absolute" top="1rem" right="1rem" bg="transparent" border="none" outline="none">
              <FontAwesomeIcon icon={faCaretLeft} size="lg" />
            </Box>            
            <DrawerHeader align="center">Medical Support</DrawerHeader>

            <DrawerBody>
              <Stack spacing={10} align="center">
                {SidebarData.map((val, key) => (
                  <Box
                    key={key}
                    onClick={() => { navigate(val.link) }}
                    align="center"
                    size="md"
                    _hover={{ 
                      bg: 'gray.200', 
                      cursor: 'pointer',
                      w: '50%',
                      h: '100%',
                    }}
                    p={2}
                    borderRadius="md"
                  >
                    <Box >{val.icon}</Box>
                    <Box fontSize={24}>{val.title}</Box>
                  </Box>
                ))}
              </Stack>
            </DrawerBody>

            <DrawerFooter>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

    </>
  );
};

export default Sidebar;