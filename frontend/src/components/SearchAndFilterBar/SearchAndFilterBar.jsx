import React, {useState} from "react";
import { Checkbox, Flex, Grid, GridItem, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, Select, Spacer, Stack, Text } from '@chakra-ui/react'
import Search from "../Search/Search";
import Filter from "../Filter/Filter";
import { format } from 'date-fns'
import FilterTag from "../Filter/FilterTag";
import { HStack } from "@chakra-ui/react";
import CalendarCustomize from "../Calendar/Calendar";
import Calendar from "react-calendar";
import LayoutSelector from "../LayoutSelector/LayoutSelector";
import GoToPage from "../GoToPage/GoToPage";
import { ThemeProvider, createTheme } from "@mui/material";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

const SearchAndFilterBar = (props) => {
    // const [props.adms, props.setAdms] = useState(null);
    // const [props.disc, props.setprops.disc] = useState(null);
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
    const theme = createTheme({
        sizes: {
          container: props.size || '800px',
        },
      });
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
                h='190px'
                templateRows='repeat(3, 1fr)'
                templateColumns='repeat(10, 1fr)'
                // gap={1}
                >
                <GridItem rowSpan={1} colSpan={9}>
                    <Search setSearchInput={props.setSearchInput} onClick={props.onClick} onChange={props.onChange}/>
                </GridItem>
                <GridItem  rowSpan={1} colSpan={1}>
                    <Flex justifyContent={'flex-end'}>
                    <Filter
                        adms={props.patient ? props.adms: null}
                        setAdms={props.patient ? props.setAdms: null}
                        disc={props.patient ? props.disc : null}
                        setDisc={props.patient ? props.setDisc : null}
                        patient={props.patient ? props.patient : false}
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
                            props.adms ?
                            <Popover closeOnBlur={true}> 
                                <FilterTag name={'Admission date'} key={'adms'} onClick={() => props.setAdms(null)} text={'Admission from ' + format(props.adms, 'dd-MMM-yyyy')} /> 
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                        <PopoverBody maxH={'500px'} mt={2} overflow={'auto'}>
                                            <Calendar value={props.adms} onChange={props.setAdms} />
                                        </PopoverBody>
                                </PopoverContent>
                            </Popover> : null
                        }
                        {
                            props.disc ?
                            <Popover closeOnBlur={true}> 
                                <FilterTag name={'Discharge date'} key={'disc'} onClick={() => props.setDisc(null)} text={'Discharge from ' + format(props.disc, 'dd-MMM-yyyy')} />
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                        <PopoverBody maxH={'500px'} mt={2} overflow={'auto'}>
                                            <Calendar value={props.disc} onChange={props.setDisc} />
                                        </PopoverBody>
                                </PopoverContent>
                            </Popover> : null
                        }
                        {/* {
                            gender ? <FilterTag name={'gender'} key={'gender'} onClick={() => {setGender(null)}} text={gender == 1 ? 'Female' : gender == 2 ? 'Male' : gender == 3 ? 'All' : null} /> : null
                        } */}
                        {
                            props.dynamicFilter.map(item => (
                                <Popover closeOnBlur={true}>
                                    <FilterTag name={props.patient ? item.name : mapping[item.name]} key={item.name} onClick={() => AddFilter(item.name, item.value)} text={item.value}/>
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
                <GridItem colStart={6} rowSpan={1} colSpan={2} paddingTop={2} >
                    <HStack>
                    <Text paddingTop={2}>Sort: </Text>
                    <Select w={'200px'} onChange={(e) => props.setSortBy(e.target.value)}>
                        {  
                            props.patient? (
                                <>
                                    <option value="subject_id">Subject ID</option>
                                    <option value="Admission Time">Admission Time</option>
                                    <option value="Discharge Time">Discharge Time</option>
                                </> 
                            )
                            : null
                        }
                        {
                            props.filterData.map(item => (
                                <option value={item.name}>{props.patient ? item.name : mapping[item.name]}</option>
                            ))
                        }
                    </Select>
                    {props.ascending ? 
                        <ArrowDownIcon onClick={() => {props.setAscending(!props.ascending)}} cursor={'pointer'} _hover={{backgroundColor: '#ccc', borderRadius: '5px'}} marginTop={0} boxSize={6} />
                        :
                        <ArrowUpIcon onClick={() => {props.setAscending(!props.ascending)}} cursor={'pointer'} _hover={{backgroundColor: '#ccc', borderRadius: '5px'}} marginTop={0} boxSize={6}/>
                    }
                    </HStack>
                </GridItem>
                <GridItem colStart={8} rowSpan={1} colSpan={1}>
                <LayoutSelector
                    onChange={props.handleLayoutChange}
                    selectedLayout={props.selectedLayout} />
                </GridItem>
                <GridItem colStart={9} rowSpan={1} colSpan={1} paddingTop={2} paddingLeft={6} paddingRight={6}>
                <ThemeProvider theme={theme} >
                    <GoToPage handleGoToPage={props.handleGoToPage} goToPage={props.goToPage} setGoToPage ={props.setGoToPage}/>
                </ThemeProvider>
                </GridItem>
                <GridItem colStart={10} rowSpan={1} colSpan={1}>
                    <Select paddingTop={2} className='itemPerPage' onChange={e => props.setPageSize(Number(e.target.value))} value={props.pageSize}>
                        {props.pageSizeList.map(size => (
                            <option key={size} value={size} >
                            Show {size}
                            </option>
                        ))}
                    </Select>
                </GridItem>
                
            </Grid>
        </div>
    )
};

export default SearchAndFilterBar;