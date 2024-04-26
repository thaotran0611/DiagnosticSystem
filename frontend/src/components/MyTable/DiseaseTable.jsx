import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box } from '@chakra-ui/react';
import DiseaseCard from '../DiseaseCard/DiseaseCard';

export default function DiseaseTable(props) {
  const [diagnoses, setDiagnoses] = useState({}); // Declaration of setDiagnoses

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

  function handleDiagnosisChange(hadm_id, value) {
    setDiagnoses(prevState => ({
      ...prevState,
      [hadm_id]: value
    }));
  }

  // Group records by hadm_id
  const groupedData = props.data.reduce((acc, curr) => {
    if (!acc[curr.hadm_id]) {
      acc[curr.hadm_id] = [];
    }
    acc[curr.hadm_id].push(curr);
    return acc;
  }, {});

  // Function to check if doctor_code matches the session value
  function isDoctorAllowed(doctor_code) {
    // Replace 'sessionDoctorCode' with the actual variable storing the doctor code from the session
    const sessionDoctorCode = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    return doctor_code === sessionDoctorCode;
  }

  return (
    <Box>
      {Object.entries(groupedData).map(([hadm_id, records], index) => (
        <Table key={index} variant="simple">
          <Thead>
            <Tr>
              <Th width="25%">HADM ID</Th>
              <Th width="25%">Disease</Th>
              <Th width="25%">Prediction</Th>
              <Th width="25%">Diagnose</Th>
            </Tr>
          </Thead>
          <Tbody>
            {records.map((record, idx) => (
              <Tr key={idx}>
                {idx === 0 && <Td width="25%" rowSpan={records.length}>{record.hadm_id}</Td>}
                <Td width="25%"><DiseaseCard text={record.disease_code} /></Td>
                <Td width="25%">{renderPredict(record.predict_value)}</Td>
                <Td width="25%">
                  {isDoctorAllowed(props.doctor) ? (
                    <select value={diagnoses[hadm_id] || renderDiagnose(record.value)} onChange={(e) => handleDiagnosisChange(hadm_id, e.target.value)}>
                      <option value="Pending">Pending</option>
                      <option value="Positive">Positive</option>
                      <option value="Negative">Negative</option>
                    </select>
                  ) : (
                    renderDiagnose(record.value)
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ))}
    </Box>
  );
}
