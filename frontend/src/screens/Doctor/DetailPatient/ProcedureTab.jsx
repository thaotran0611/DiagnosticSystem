import { Box, Grid, GridItem } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyTable2 from "../../../components/MyTable/MyTable2";

const ProcedureTab = (props) => {

    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';

    const [procedure, setProcedure] = useState([]); // PASS AS PARAMETER
    const [loadingProcedure, setLoadingProcedure] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/patients-detail-procedure', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: props.subject_id
                    }
                });
                setProcedure(response.data.procedure);
                setLoadingProcedure(false);
                // console.log(procedure)
            } catch (error) {
                setError(error);
                setLoadingProcedure(false);
            }
        };
        fetchData();
    }, []);

    return(
        <Box h={'100%'}>
            <MyTable2 data ={procedure} height={'620px'}/>
        </Box>
    )
}

export default ProcedureTab;