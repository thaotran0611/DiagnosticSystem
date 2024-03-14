import React, { useState } from "react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
  } from '@chakra-ui/react'

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
  } from '@chakra-ui/react'
import Calendar from "../Calendar/Calendar"
import { Button } from "@chakra-ui/react";
import { IoChevronDown } from "react-icons/io5";
import { Radio, RadioGroup } from '@chakra-ui/react'
import { Stack } from "@chakra-ui/react";
const Filter = (props) => {
    return (
        <Menu closeOnSelect={false} direction="rtl">
            <MenuButton as={Button} rightIcon={<IoChevronDown/>}>
                Filter
            </MenuButton>
            <MenuList>
                <Popover closeOnBlur={false}>
                    <PopoverTrigger>
                        <MenuItem>Admission from</MenuItem>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Date</PopoverHeader>
                        <PopoverBody>
                            <Calendar value={props.adms} onChange={props.onChangeAdms}/>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
                
                <Popover closeOnBlur={false}>
                    <PopoverTrigger>
                        <MenuItem>Discharge from</MenuItem>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Date</PopoverHeader>
                        <PopoverBody>
                            <Calendar value={props.disc} onChange={props.onChangeDisc}/>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            
                <Popover closeOnBlur={false}>
                    <PopoverTrigger>
                        <MenuItem>Gender</MenuItem>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>
                        <RadioGroup name="GenderRadius">
                            <Stack spacing={5} direction='row'>
                                <Radio colorScheme='red' value='1' onChange={props.onChangeFemale}>
                                    Female
                                </Radio>
                                <Radio colorScheme='green' value='2' onChange={props.onChangeMale}>
                                    male
                                </Radio>
                                <Radio colorScheme="blue" value='3' onChange={props.onChangeAll}>all</Radio>
                            </Stack>
                        </RadioGroup>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
                <MenuItem onClick={props.onClickRecently} value={'recently'}>Recently</MenuItem>
            </MenuList>
        </Menu>
    )
};

export default Filter;