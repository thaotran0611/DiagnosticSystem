import React, { useState, useEffect } from 'react'; // Importing useEffect
import { Table, Thead, Tbody, Tr, Th, Td, Box, Button, Text, Center, Flex } from '@chakra-ui/react';
import DiseaseCard from '../DiseaseCard/DiseaseCard';
import DiseaseNote from './DiseaseNote';
import { format } from "date-fns";

export default function DiseaseTable(props) {
  const [diagnoses, setDiagnoses] = useState({}); // Declaration of setDiagnoses
  const [saveEnabled, setSaveEnabled] = useState(false); // State to track if save button is enabled
  const [noteChangeIndex, setNoteChangeIndex] = useState([])

  function handleCancel() {
    console.log("Back Up Data")
    console.log(props.backup)
    props.setData([...props.backup])
  }
  function renderDiagnose(value) {
    if (value === null || value === undefined) {
      return 'Pending';
    } else if (value === true) {
      return 'Positive';
    } else {
      return 'Negative';
    }
  }

  function renderPredict(value) {
    if (value === 1 ) {
      return 'Positive'
    } else {
      return 'Negative';
    }
  }

  function handleDiagnosisChange(index, value) {
    let updateValue = null;
    if (value === 'Positive'){
      updateValue = true;
    }
    else if (value === 'Negative') {
      updateValue = false;
    }
    const updatedData = props.data.map((record, i) => {
      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      if (i === index) {
        return { ...record, value: updateValue, time: currentDate};
      }
      return record;
    });
    console.log(updatedData);
    props.setData(updatedData);
  }

  // Function to check if doctor_code matches the session value
  function isDoctorAllowed(doctor_code) {
    // Replace 'sessionDoctorCode' with the actual variable storing the doctor code from the session
    const sessionDoctorCode = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    return doctor_code === sessionDoctorCode;
  }

  function handleSave() {
      const sessionDoctorCode = sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user')).code
      : '0';
      props.setBackup(props.data);
      const postData = {
        doctor_code: sessionDoctorCode,
        hadm_id: props.hadmID,
        data: props.data,
    };

    // Send requestData to the backend API endpoint
    fetch('http://localhost:8000/update-annotate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
    .then(response => {
        if (response.ok) {
            console.log('Data saved successfully.');
            // Optionally, you can handle success actions here
        } else {
            console.error('Failed to save data.');
            // Optionally, you can handle error actions here
        }
    })
    .catch(error => {
        console.error('Error saving data:', error);
        // Optionally, you can handle error actions here
  });  }
  function handleTextChange(index, value) {
    if (value ===''){
      value = null
    }
    const updatedData = props.data.map((record, i) => {
      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      if (i === index) {
        return { ...record, note: value, time: currentDate};
      }
      return record;
    });
    console.log(updatedData);
    props.setData(updatedData);  }

  const canSave = isDoctorAllowed(props.doctor);
    console.log(canSave)
  
  useEffect(() => {
    if (canSave) {
      setSaveEnabled(true);
    } else {
      setSaveEnabled(false);
    }
  }, [canSave]);

  return (
    <Box>
      <Center>
      <Text fontSize="xl" fontWeight="bold" mt={5} mb={10}>PREDICTION DISEASES FOR ADMISSION ID: {props.hadmID}</Text>
      </Center>
      <Table key={props.data.map(item => item.note).join('_')} variant="simple">
        <Thead>
          <Tr>
            <Th width="5%" fontSize="l" fontWeight="bold" textAlign="center">Index</Th>
            <Th width="20%" fontSize="l" fontWeight="bold" textAlign="center">Disease</Th>
            <Th width="20%" fontSize="l" fontWeight="bold" textAlign="center">Prediction</Th>
            <Th width="20%" fontSize="l" fontWeight="bold" textAlign="center">Diagnose</Th>
            <Th width="35%" fontSize="l" fontWeight="bold" textAlign="center">Note</Th> 
          </Tr>
        </Thead>
        <Tbody>
          {props.data.map((record, idx) => (
            <Tr key={idx}>
              <Td width="5%" textAlign="center">{idx+1}</Td>
              <Td width="20%" textAlign="center"><DiseaseCard text={record.disease_code} /></Td>
              <Td width="20%"textAlign="center">{renderPredict(record.predict_value)}</Td>
              <Td width="20%" textAlign="center">
                {isDoctorAllowed(props.doctor) ? (
                  <select value={renderDiagnose(record.value)} onChange={(e) => handleDiagnosisChange(idx, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                  </select>
                ) : (
                  renderDiagnose(record.value)
                )}
              </Td>
              <Td width="35%">
                {isDoctorAllowed(props.doctor) ? ( // Render text input if doctor has permission
                  <DiseaseNote idx={idx} note={record.note} onSave={handleTextChange}/>
                  // <textarea
                  //   type="text"
                  //   value={record.note || ''} // Assuming record has a 'text' property
                  //   onChange={(e) => handleTextChange(idx, e.target.value)} // Handle text change
                  //   style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)', outline: 'none' }}
                  // />
                ) : (
                  record.note // Render text if doctor doesn't have permission
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {canSave && (
        <Flex justifyContent="flex-end" mt={2} mb={2} mr={5}>
          <Button onClick={handleCancel} mr={4}>Cancel</Button>
        {canSave && (
          <Button backgroundColor="#3E36B0" color={'#fff'} onClick={handleSave} disabled={!canSave || !saveEnabled}>Save</Button>
        )}
      </Flex>      )}
    </Box>
  );
}
