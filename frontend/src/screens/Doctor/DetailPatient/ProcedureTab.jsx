import { Box, Grid, GridItem } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyTable2 from "../../../components/MyTable/MyTable2";

const ProcedureTab = (props) => {

    const doctor_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';

    // const [procedure, setProcedure] = useState([]); // PASS AS PARAMETER
    // const [loadingProcedure, setLoadingProcedure] = useState(true);
    const [error, setError] = useState(null);
    const procedure = props.procedure;
    // const subject_id =  props.subject_id
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:8000/patients-detail-procedure', {
    //                 params: {
    //                     doctor_code: doctor_code,
    //                     subject_id: subject_id
    //                 }
    //             });
    //             setProcedure(response.data.procedure);
    //             setLoadingProcedure(false);
    //             // console.log(procedure)
    //         } catch (error) {
    //             setError(error);
    //             setLoadingProcedure(false);
    //         }
    //     };
    //     if (procedure.length === 0) {
    //         fetchData();
    //     }
    //     }, [procedure, doctor_code, subject_id]);
    const [selectedRow, setSelectedRow] = useState(null); // PASS AS PARAMETER
    const handleRecordSelection = (record) => {
        setSelectedRow(record);
    };
    return(
        <Box h={'98%'}>
            <MyTable2 tablename='Table of procedure' onSelect={handleRecordSelection} data={props.hadmID === 'All Admission' ? procedure : procedure.filter((item) => {
                        const itemValue = String(item['Admission ID']);
                        return itemValue.includes(props.hadmID);
                    })} height={'580px'}/>
        </Box>
    )
}

export default ProcedureTab;