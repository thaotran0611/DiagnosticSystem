import { Box, Grid, GridItem } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/patients-annotate', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: subject_id
                    }
                });
                setAnnotate(response.data.annotate);
                setLoadingAnnotate(false);
                console.log(annotate)
            } catch (error) {
                setError(error);
                setLoadingAnnotate(false);
            }
        };
        fetchData();
    }, []);

    return(
        
        <Box h={'100%'}>
            {/* <MyTable2 editable={true} height={'680px'}/> */}
            <DiseaseTable />
        </Box>
    )
}

export default DiseasesTab;