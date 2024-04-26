import { Box, Grid, GridItem } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select } from '@chakra-ui/react'

// import MyTable2 from "../../../components/MyTable/MyTable2";
import DiseaseTable from "../../../components/MyTable/DiseaseTable";
const DiseasesTab = (props) => {
    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';


    const subject_id = props.subject_id;

    const [annotate, setAnnotate] = useState([]); // PASS AS PARAMETER
    const [loadingAnnotate, setLoadingAnnotate] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:8000/patients-annotate', {
    //                 params: {
    //                     doctor_code: doctor_code,
    //                     subject_id: subject_id
    //                 }
    //             });
    //             setAnnotate(response.data.annotate);
    //             setLoadingAnnotate(false);
    //             // console.log(annotate)
    //         } catch (error) {
    //             setError(error);
    //             setLoadingAnnotate(false);
    //         }
    //     };
    //     if (annotate.length === 0) {
    //         fetchData();
    //     }
    // }, [annotate, doctor_code, subject_id]);

    const [shouldRenderTable, setShouldRenderTable] = useState(false); // State variable to track whether the table should be rendered
    const [hadmID, sethadmID] = useState('All Admission');
    const [change, setChange] = useState(false)
    const [doctor, setDoctor] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/predict', {
                    params: {
                        hadm_id: hadmID
                    }
                });
                setAnnotate(response.data.annotate);
                setDoctor(response.data.doctor);
                setLoadingAnnotate(false);
                console.log(doctor)
            } catch (error) {
                setError(error);
                setLoadingAnnotate(false);
            }
        };
        if (change && hadmID !== 'All Admission') {
            fetchData();
        }
    }, [hadmID]);
    
    const handleHadmIDChange = (e) => {
        setShouldRenderTable(hadmID !== 'All Admission'); // Set shouldRenderTable to true only if hadmID is different from the new value
        setChange(e.target.value !== hadmID)
        sethadmID(e.target.value);
    };
    return(
        <Box h={'100%'}>
            <Select onChange={handleHadmIDChange} fontWeight={600} color={'#3E36B0'} variant={'outline'}>
                {
                    props.allAdmission.map(item => (
                        <option selected={item === hadmID ? true : false} value={item}>{item}</option>
                    ))
                }
            </Select>
            {/* <MyTable2 editable={true} height={'680px'}/> */}
            {<DiseaseTable data={annotate} doctor={doctor} />} 
        </Box>
    )
}

export default DiseasesTab;