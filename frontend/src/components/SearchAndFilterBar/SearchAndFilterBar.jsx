import React, {useState} from "react";
import { Grid, GridItem, Spacer } from '@chakra-ui/react'
import Search from "../Search/Search";
import Filter from "../Filter/Filter";
import { format } from 'date-fns'
import FilterTag from "../Filter/FilterTag";
import { HStack } from "@chakra-ui/react";

const SearchAndFilterBar = (props) => {
    const [adms, setAdms] = useState(null);
    const [disc, setDisc] = useState(null);
    const [gender, setGender] = useState(0);
    const [recently, setRecently] = useState(false)
    return(
        <div style={{width: '100%'}}>
            <Grid
                h='150px'
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(10, 1fr)'
                gap={4}
                >
                <GridItem rowSpan={1} colSpan={10} style={{padding: '5px'}}>
                    <Search/>
                </GridItem>
                <GridItem rowSpan={1} colSpan={9}>
                    <HStack spacing={4}>
                        {
                            adms ? <FilterTag key={'adms'} onClick={() => {setAdms(null)}} text={'Admission from ' + format(adms, 'dd-MMM-yyyy')} /> : null
                        }
                        {
                            disc ? <FilterTag key={'disc'} onClick={() => {setDisc(null)}} text={'Discharge from ' + format(disc, 'dd-MMM-yyyy')} /> : null
                        }
                        {
                            gender ? <FilterTag key={'gender'} onClick={() => {setGender(null)}} text={gender == 1 ? 'Female' : gender == 2 ? 'Male' : gender == 3 ? 'All' : null} /> : null
                        }
                        {
                            recently ? <FilterTag key={'disc'} onClick={() => {setRecently(false)}} text={'Recently'} /> : null
                        }
                    </HStack>
                </GridItem>
                <GridItem rowSpan={1}colSpan={1} padding={'0 0 20px 18px'}>
                    <Filter
                        adms={adms}
                        onChangeAdms={setAdms}
                        disc={disc}
                        onChangeDisc={setDisc}
                        onChangeFemale={(e) => {setGender(e.target.value)}}
                        onChangeMale={(e) => {setGender(e.target.value)}}
                        onChangeAll={(e) => {setGender(e.target.value)}}
                        onClickRecently={(e) => {setRecently(e.target.value)}}
                        />
                </GridItem>
            </Grid>
        </div>
    )
};

export default SearchAndFilterBar;