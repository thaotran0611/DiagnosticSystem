import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react';
import DiseaseCard from '../DiseaseCard/DiseaseCard';

export default function DiseaseTable(props) {
  const data = [{'disease_code': 'AA', 'value': false, 'time': '2024-04-18 16:46:59'}
              , {'disease_code': 'CND', 'value': false, 'time': '2024-04-18 16:46:59'}]
  // console.log(props.data)
  return (
    <TableContainer>
      <Table variant='simple'>
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <Thead>
          <Tr>
            <Th width='50%'>Disease</Th> {/* Set width for the Disease column */}
            <Th width='25%'>%</Th> {/* Set width for the % column */}
            <Th width='25%'>Diagnose</Th> {/* Set width for the Diagnose column */}
          </Tr>
        </Thead>
        <Tbody>
          {props.data.map((row, index) => (
            <Tr key={index}>
              <Td width='50%'><DiseaseCard text={row.disease_code}/></Td> {/* Set width for the Disease column */}
              <Td width='25%'>70% </Td> {/* Set width for the % column */}
              <Td width='25%'>Pending</Td> {/* Set width for the Diagnose column */}
            </Tr>
          ))}
        </Tbody>
        {/* Tfoot section if needed */}
      </Table>
    </TableContainer>
  );
}
