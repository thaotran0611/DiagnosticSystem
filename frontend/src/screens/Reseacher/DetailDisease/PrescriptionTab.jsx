import { Box, Button, Checkbox, Grid, GridItem, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import MyTable2 from "../../../components/MyTable/MyTable2";

const PrescriptionTab = (props) => {
    let otherdiseasesValue = [{
            name: 'AA',
            label: 'Alcohol Abuse',
            value: 0,
        },{
            name: 'CND',
            label: 'Chronic Neuro Dystrophies',
            value: 0,
        },{
            name: 'SA',
            label: 'Subtance Abuse',
            value: 0,
        },{
            name: 'CP',
            label: 'Chronic Pain',
            value: 0,
        },{
            name: 'Dep',
            label: 'Depression',
            value: 0,
        },{
            name: 'MC',
            label: 'Metastatic Cancer',
            value: 0,
        },{
            name: 'Ob',
            label: 'Obesity',
            value: 0,
        },{
            name: 'PD',
            label: 'Psychiatric Disorders',
            value: 0,
        },{
            name: 'HD',
            label: 'Advanced Heart Disease',
            value: 0,
        },{
            name: 'LD',
            label: 'Advanced Lung Disease',
            value: 0,
        }
    ]
    const [codiseases, setCodiseases] = useState([]);
    const handleOnChange = (disease) => {
        if (codiseases.findIndex(item => item === disease) !== -1){
            const index = codiseases.findIndex(item => item === disease)
            setCodiseases(codiseases.filter((_, i) =>  i !== index))
        } else {
            setCodiseases((prev) => [...prev, disease])
        }
        console.log(codiseases);
    }
    let filterOtherDiseases = props.prescription.filter(item => 
        codiseases.every(disease => item[disease] === 1)
    ).map(item => ({Drug: item.drug, Drug_type: item.drug_type, Drug_name_poe: item.drug_name_poe, Drug_name_generic: item.drug_name_generic, Frequency: item.frequency}))
    return(
        
        <Box h={'98%'}>
            <HStack>
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
                                    otherdiseasesValue.map(item => (
                                        <Checkbox onChange={(e) => handleOnChange(e.target.value)} value={item.name}>{item.label}</Checkbox>
                                    ))
                                }
                            </Stack>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </HStack>
            <MyTable2 onSelect = {()=>{}} data={filterOtherDiseases} tablename={'Table of prescriptions with diseases: ' + codiseases.map(item => " "+ item)} height={'590px'}/>
        </Box>
    )
}

export default PrescriptionTab;