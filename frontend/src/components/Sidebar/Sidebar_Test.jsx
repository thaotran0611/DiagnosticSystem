import React, { useState } from 'react';
import { Box, Stack, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Grid, GridItem } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { SidebarData } from './SidebarData.js';

const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton icon={<HamburgerIcon />} aria-label="Open Sidebar" onClick={onOpen} />

      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader align="center">Medical Support</DrawerHeader>

            <DrawerBody>
              <Stack spacing={10} align="center">
                {SidebarData.map((val, key) => (
                  <Box
                    key={key}
                    onClick={() => { window.location.pathname = val.link }}
                    align="center"
                    size="sm"
                    _hover={{ 
                      bg: 'gray.200', 
                      cursor: 'pointer',
                      w: '100%',
                      h: '100%',
                    }}
                    p={2}
                    borderRadius="md"
                  >
                    <Box>{val.icon}</Box>
                    <Box>{val.title}</Box>
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
