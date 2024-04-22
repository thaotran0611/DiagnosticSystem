import { Box, Grid, GridItem } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyTable2 from "../../../components/MyTable/MyTable2";

const PrescriptionTab = (props) => {
    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';

    const [Prescription, setPrescription] = useState([]); // PASS AS PARAMETER
    const [loadingPrescription, setLoadingPrescription] = useState(true);
    const [error, setError] = useState(null);

    const subject_id =  props.subject_id

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/patients-detail-prescription', {
                    params: {
                        doctor_code: doctor_code,
                        subject_id: subject_id
                    }
                });
                setPrescription(response.data.prescription);
                setLoadingPrescription(false);
                console.log(Prescription)
            } catch (error) {
                setError(error);
                setLoadingPrescription(false);
            }
        };
        if (Prescription.length === 0) {
            fetchData();
        }    
    }, [Prescription, doctor_code, subject_id]);

    return(
        <Box h={'100%'}>
            <MyTable2 data={props.hadmID === 'All Admission' ? Prescription : Prescription.filter((item) => {
                        const itemValue = String(item.hadm_id);
                        return itemValue.includes(props.hadmID);
                    })} height={'620px'}/>
        </Box>
    )
}

export default PrescriptionTab;