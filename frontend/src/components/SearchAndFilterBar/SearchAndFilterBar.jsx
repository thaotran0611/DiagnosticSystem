import React, {useState} from "react";
import { Checkbox, Flex, Grid, GridItem, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, Spacer, Stack } from '@chakra-ui/react'
import Search from "../Search/Search";
import Filter from "../Filter/Filter";
import { format } from 'date-fns'
import FilterTag from "../Filter/FilterTag";
import { HStack } from "@chakra-ui/react";

const SearchAndFilterBar = (props) => {
    const [adms, setAdms] = useState(null);
    const [disc, setDisc] = useState(null);
    const [gender, setGender] = useState(0);
    const AddFilter = (name, value) => {
        // Dynamically set a property in the object
        if (props.dynamicFilter.find(item => item.name === name && item.value === value)) {
            props.setDynamicFilter(props.dynamicFilter.filter(item => item.value !== value));
        }
        else {
            props.setDynamicFilter((prevValues) => ([
            ...prevValues,
            {name: name, value: value}
            ]));
        }
    };
    const ChangeFilter = (name, old_value, new_value) => {
        if (props.dynamicFilter.find(item => item.name === name && item.value === new_value)){
            AddFilter(name, new_value);
        }
        else {
            props.setDynamicFilter(props.dynamicFilter.find(item => item.name === name && item.value === old_value).value = new_value);
            const updatedDynamicFilter = props.dynamicFilter.map(item => {
                if (item.value === old_value) {
                // Return a new object with updated quantity
                return { ...item, value: new_value};
                }
                return item; // Return unchanged item for other items
            });
            props.setDynamicFilter(updatedDynamicFilter); // Update state with the new array
            // AddFilter(name, new_value);
        }
    }
    return(
        <div style={{width: '100%'}}>
            <Grid
                h='180px'
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(10, 1fr)'
                gap={1}
                >
                <GridItem rowSpan={1} colSpan={9}>
                    <Search setSearchInput={props.setSearchInput} onClick={props.onClick} onChange={props.onChange}/>
                </GridItem>
                <GridItem  rowSpan={1} colSpan={1}>
                    <Flex justifyContent={'flex-end'}>
                    <Filter
                        adms={adms}
                        onChangeAdms={setAdms}
                        disc={disc}
                        onChangeDisc={setDisc}
                        onChangeFemale={(e) => {setGender(e.target.value)}}
                        onChangeMale={(e) => {setGender(e.target.value)}}
                        onChangeAll={(e) => {setGender(e.target.value)}}
                        filterData = {props.filterData}
                        setDynamicFilter = {AddFilter}
                        dynamicFilter = {props.dynamicFilter}
                        searchItems = {props.searchItems}
                        />
                    </Flex>
                </GridItem>
                <GridItem rowSpan={1} colSpan={10}  overflowX="scroll" sx={{
                    '&::-webkit-scrollbar': {
                    width: '1px', // Set the width of the scrollbar
                    height: '5px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'gray.400', // Set the color of the scrollbar thumb
                    borderRadius: 'full', // Set the border radius of the thumb to make it round
                    },
                }}>
                    <HStack spacing={4}>
                        {
                            adms ? <FilterTag name={'admission date'} key={'adms'} onClick={() => {setAdms(null)}} text={'Admission from ' + format(adms, 'dd-MMM-yyyy')} /> : null
                        }
                        {
                            disc ? <FilterTag name={'discharge date'} key={'disc'} onClick={() => {setDisc(null)}} text={'Discharge from ' + format(disc, 'dd-MMM-yyyy')} /> : null
                        }
                        {
                            gender ? <FilterTag name={'gender'} key={'gender'} onClick={() => {setGender(null)}} text={gender == 1 ? 'Female' : gender == 2 ? 'Male' : gender == 3 ? 'All' : null} /> : null
                        }
                        {
                            props.dynamicFilter.map(item => (
                                <Popover closeOnBlur={true}>
                                    <FilterTag name={item.name} key={item.name} onClick={() => AddFilter(item.name, item.value)} text={item.value}/>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverBody maxH={'500px'} mt={2} overflow={'auto'}>
                                            {
                                            props.filterData.find(item2 => item2.name === item.name).data.map(value => (
                                                <Stack pl={6} mt={3} spacing={1}>
                                                    <Checkbox value={value}
                                                    onChange={() => {ChangeFilter(item.name, item.value, value); props.searchItems()}}
                                                    isChecked={props.dynamicFilter.find(a => a.name === item.name && a.value === value) ? true : false}
                                                    >
                                                        {value}
                                                    </Checkbox>
                                                </Stack>
                                            ))}
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            ))
                        }
                    </HStack>
                </GridItem>
                
            </Grid>
        </div>
    )
};

export default SearchAndFilterBar;