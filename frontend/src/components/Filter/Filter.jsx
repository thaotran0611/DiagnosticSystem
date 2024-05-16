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
    Checkbox,
    Text,
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
    const mapping = {
        disease_code: 'Code',
        sum_of_admission: 'Admissions',
        sum_of_male: 'Male',
        sum_of_female: 'Female',
        disease_name: 'Name',
        drug_type: 'Drug Type',
        gender: 'Gender',
        role: 'Role',
        type_file: 'Type of file',
        type_of_disease: 'Type of disease'
    }
    
    return (
        <Menu flip={true} closeOnSelect={false} direction="ltr">
            <MenuButton width={'80%'} bgColor={'#3E36B0'} color={'#fff'} as={Button} rightIcon={<IoChevronDown/>}>
                Filter
            </MenuButton>
            <MenuList>
                {props.patient ? 
                <Popover closeOnBlur={true}>
                    <PopoverTrigger>
                        <Text padding={2} _hover={{bgColor: '#EDF2F7'}} cursor={'pointer'}>Admission from</Text>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Date</PopoverHeader>
                        <MenuItem>
                        <PopoverBody>
                            <Calendar value={props.adms} onChange={props.setAdms}/>
                        </PopoverBody>
                        </MenuItem>
                    </PopoverContent>
                </Popover>
                : null }
                {props.patient ? 
                <Popover closeOnBlur={false}>
                    <PopoverTrigger>
                        <Text padding={2} _hover={{bgColor: '#EDF2F7'}} cursor={'pointer'}>Discharge from</Text>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Date</PopoverHeader>
                        <MenuItem>
                        <PopoverBody>
                            <Calendar value={props.disc} onChange={props.setDisc}/>
                        </PopoverBody>
                        </MenuItem>
                    </PopoverContent>
                </Popover> 
                : null }
                {
                    props.filterData.map(item => (
                        <Popover closeOnBlur={true}>
                            <PopoverTrigger>
                                <Text padding={2} _hover={{bgColor: '#EDF2F7'}} cursor={'pointer'}>{props.patient ? item.name : mapping[item.name]}</Text>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <MenuItem>

                                <PopoverBody maxH={'500px'} mt={2} overflow={'auto'}>
                                    {
                                    item.data.map(value => (
                                        <Stack pl={6} mt={3} spacing={1}>

                                            <Checkbox value={value}
                                            onChange={() => {props.setDynamicFilter(item.name, value); props.searchItems()}}
                                            isChecked={props.dynamicFilter.find(a => a.name === item.name && a.value === value) ? true : false}
                                            >
                                                {value}
                                            </Checkbox>

                                        </Stack>
                                    ))}
                                </PopoverBody>
                                </MenuItem>

                            </PopoverContent>
                        </Popover>
                    ))
                }
            </MenuList>
        </Menu>
    )
};

export default Filter;