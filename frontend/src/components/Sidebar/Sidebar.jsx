import React, { useState } from 'react';
import { Box, Stack, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Grid, GridItem } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { SidebarDataDoctor, SidebarDataResearcher, SidebarDataAnalyst, SidebarDataAdmin } from './SidebarData.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({role}) => {
  let SidabarData = null;
  if (role === 1) {
    SidabarData = SidebarDataDoctor
  }
  else if (role === 2) {
    SidabarData = SidebarDataResearcher
  }
  else if (role === 3) {
    SidabarData = SidebarDataAnalyst
  }
  else if (role === 4) {
    SidabarData = SidebarDataAdmin
  }
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
  <IconButton icon={<FontAwesomeIcon icon={faCaretRight} />} aria-label="Open Sidebar" onClick={onOpen} />
      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
        <DrawerOverlay>
          <DrawerContent>
          <Box as="button" onClick={onClose} position="absolute" top="1rem" right="1rem" bg="transparent" border="none" outline="none">
              <FontAwesomeIcon icon={faCaretLeft} size="lg" />
            </Box>            
            <DrawerHeader align="center">Medical Support</DrawerHeader>

            <DrawerBody>
              <Stack spacing={10} align="center">
                {SidabarData.map((val, key) => (
                  <Box
                    key={key}
                    onClick={() => { window.location.pathname = val.link }}
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
