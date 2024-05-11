import { Box, Button, Checkbox, Grid, GridItem, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Select, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import MyTable2 from "../../../components/MyTable/MyTable2";

const PrescriptionTab = (props) => {
    const getLastTenKeys = (objArray) => {
        // Get the keys of the last object in the array
        const lastObjectKeys = Object.keys(objArray[objArray.length - 1]);
        
        // Get the last 10 keys from the array
        const lastTenKeys = lastObjectKeys.slice(-10);
        
        return lastTenKeys;
    }
    const diseases = props.otherdrugs.length > 0 ? getLastTenKeys(props.otherdrugs) : [];
    const [codiseases, setCodiseases] = useState([]);
    const handleOnChange = (disease) => {
        if (codiseases.findIndex(item => item === disease) !== -1){
            const index = codiseases.findIndex(item => item === disease)
            setCodiseases(codiseases.filter((_, i) =>  i !== index))
        } else {
            setCodiseases((prev) => [...prev, disease])
        }
    }
    let filterData = [];
    filterData = props.otherdrugs.filter((item)=>{
        return codiseases.every((disease) => item[disease] === 1)
    }).reduce((acc, obj) => {
        const drug = obj.drug;
        const drug_type = obj.drug_type;
        const drug_name_poe = obj.drug_name_poe;
        const formulary_drug_cd = obj.formulary_drug_cd;
        const index = acc.findIndex((item) => item.drug === drug && item.drug_type === drug_type && item.drug_name_poe === drug_name_poe && item.formulary_drug_cd === formulary_drug_cd)
        if(index !== -1){
            acc[index].prescribed_together_time = acc[index].prescribed_together_time + 1
        }else{
            acc.push({
                drug : drug,
                drug_type: drug_type,
                drug_name_poe: drug_name_poe,
                formulary_drug_cd: formulary_drug_cd,
                prescribed_together_time: 1
            })
        }
        return acc;
    }, []);
    console.log(filterData);
    return(
        <Box h={'90%'}>
            <HStack spacing={2}>
                <Popover closeOnBlur={true}>
                    <PopoverTrigger>
                        <Button>Add co-morbidities +</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody maxH={'200px'} mt={2} overflow={'auto'}>
                            <Stack pl={6} mt={3} spacing={1}>
                                {
                                    diseases.map(item => (
                                        <Checkbox onChange={(e) => handleOnChange(e.target.value)} value={item}>{item}</Checkbox>
                                    ))
                                }
                            </Stack>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
                <Text>
                    {
                       ' ' + codiseases.map(disease => " " + disease)
                    }
                </Text>
            </HStack>
            <MyTable2 data={filterData} tablename={'Table of co-prescribed-medication '} height={'600px'} onSelect={()=>{}}/>
        </Box>
    )
}

export default PrescriptionTab;