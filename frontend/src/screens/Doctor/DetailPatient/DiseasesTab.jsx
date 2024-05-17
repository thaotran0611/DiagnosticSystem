import { Box, Grid, GridItem } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Text } from '@chakra-ui/react'

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
    const [backupData, setBackupData] = useState([])

    const [shouldRenderTable, setShouldRenderTable] = useState(false); // State variable to track whether the table should be rendered
    const [hadmID, sethadmID] = useState('All Admission');
    const [change, setChange] = useState(false)
    const [doctor, setDoctor] = useState('')
    const [tableKey, setTableKey] = useState(0);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        // Update tableKey to trigger re-render
        setTableKey(prevKey => prevKey + 1);
    }, [annotate]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/predict', {
                    params: {
                        hadm_id: hadmID
                    }
                });
                if (response.data.message){
                    setMessage('Not Null')
                }
                else{
                    setMessage(null)
                }
                setAnnotate(response.data.annotate);
                setDoctor(response.data.doctor);
                setBackupData(response.data.annotate)
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
        setShouldRenderTable(hadmID !== 'All Admission'); 
        setChange(e.target.value !== hadmID)
        if (change){
            setAnnotate([]);
            setDoctor('');
        }
        setMessage(null)
        sethadmID(e.target.value);
    };
    return(
        <Box h={'100%'} position={'relative'}>
            <Select onChange={handleHadmIDChange} fontWeight={600} color={'#3E36B0'} variant={'outline'}>
                {
                    props.allAdmission.map(item => (
                        <option selected={item === hadmID ? true : false} value={item['Admission ID']}>{item['Admission ID'] === 'All Admission' ? item['Admission ID'] : item['Admission ID'] + '   -   ' + item['Admission Time'] + '   -   ' + item['Admission Type']+ '   -   ' + item['Admission Location']}</option>
                    ))
                }
            </Select>
            {
            hadmID !== 'All Admission' 
                ? (message === null 
                    ? <DiseaseTable key={tableKey} backup={backupData} setBackup={setBackupData} setData={setAnnotate} data={annotate} doctor={doctor} hadmID={hadmID}/> 
                    : <Text paddingTop={1} fontWeight={600} fontSize={'30px'}>This is the first admission of this patient. So there is no historical discharge summary to predict</Text>
                ) 
                : null
        }        </Box>
    )
}

export default DiseasesTab;