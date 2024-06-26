import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientCard from './PatientCard';
import { ThemeProvider, createTheme } from '@mui/material';
import MyPagination from '../Pagination/Pagination'
import LayoutSelector from '../LayoutSelector/LayoutSelector';
import { Text, Center, SimpleGrid, Stack, Flex, Box,  Button, Spacer } from '@chakra-ui/react';
import {TextField} from '@mui/material';
import GoToPage from '../GoToPage/GoToPage';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';


const PatientList = ({ size, data, onPatientSelect, selectedPatient, setSelectedPatient }) => {
  const theme = createTheme({
    sizes: {
      container: size || '800px',
    },
  });
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const pageSizeList = [10, 20, 30];
  const [pageSize, setPageSize] = useState(pageSizeList[0]);
  const [goToPage, setGoToPage] = useState("");
  useEffect(() => {
    if (data.length > 0){
      setGoToPage("1")
    }
  }, [data.length]);
  const [selectedLayout, setSelectedLayout] = useState('list');
  const handleLayoutChange = (layout) => {
    setSelectedLayout(layout);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setGoToPage(newPage.toString()); // Update the input field when page changes
  };

  const [selectedCardId, setSelectedCardId] = useState(selectedPatient ? selectedPatient.subject_id : null);
  const handleCardClickhighlight = (cardId) => {
    setSelectedCardId(cardId === selectedCardId ? null : cardId);
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPage);
    if (pageNumber >= 1 && pageNumber <= Math.ceil(data.length / pageSize)) {
      setPage(pageNumber);
    } else {
      alert(`Page number should be between 1 and ${Math.ceil(data.length / pageSize)}`);
    }
  };
  const [ascendding, setAscending] = useState(true);
  const [sortby, setSortby] = useState('subject_id');
  // const [sortResult, setSortresult] = useState(data)
  let sortResult = ascendding ? [...data].sort((a, b) => {
    if (sortby === 'subject_id'){
      return a[sortby] - b[sortby];
    } else {
      return a[sortby].toString().localeCompare(b[sortby].toString())
    }})
    : [...data].sort((a, b) => {
    if (sortby === 'subject_id'){
      return b[sortby] - a[sortby];
    } else {
      return b[sortby].toString().localeCompare(a[sortby].toString());
    }});
  // setSelectedPatient(sortResult[0]);
  let startIndex = (page - 1) * pageSize;
  let endIndex = startIndex + pageSize;
  let slicedData = sortResult.slice(startIndex, endIndex);

  let midIndex = Math.ceil(slicedData.length / 2);
  // const sort = (field) => {
  //   if ()
  // }

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ThemeProvider theme={theme} >
      <Flex justifyContent="flex-end">
        <Text pl="5" pt="2" fontSize={35} fontWeight="bold" marginRight="auto">Patient List</Text>
        <Stack direction="row" spacing="4" p="2" m='0' marginLeft="auto" mr={5}>
            <Text paddingTop={3}>Sort: </Text>
            <select   defaultValue={"subject_id"} onClick={(e) => {setSortby(e.target.value)}} style={{cursor: 'pointer'}}>
              <option value={"subject_id"}>Subject id</option>
              <option value={"name"}>Name</option>
              <option value={"Date of Birth"}>Date of Birth</option>
            </select>
            {ascendding ? 
            <ArrowDownIcon onClick={() => {setAscending(!ascendding)}} cursor={'pointer'} _hover={{backgroundColor: '#ccc', borderRadius: '5px'}} marginTop={5} boxSize={5}/>
            :
            <ArrowUpIcon onClick={() => {setAscending(!ascendding)}} cursor={'pointer'} _hover={{backgroundColor: '#ccc', borderRadius: '5px'}} marginTop={5} boxSize={5}/>
            }
            <GoToPage handleGoToPage={handleGoToPage} goToPage={goToPage} setGoToPage ={setGoToPage}/>
            <LayoutSelector
              onChange={handleLayoutChange}
              selectedLayout={selectedLayout} />
            <select className='itemPerPage' onChange={e => setPageSize(Number(e.target.value))} value={pageSize}>
              {pageSizeList.map(size => (
                <option key={size} value={size} >
                  Show {size}
                </option>
              ))}
            </select>
        </Stack>
      </Flex>
      
      <Box p={5} maxHeight="340px" overflowY="auto" style={{
            scrollbarWidth: 'thin', 
            scrollbarColor: '#A0AEC0 #ffffff', 
          }}>
          {selectedLayout === 'list' ?
          (<SimpleGrid mt={5} columns={1} spacing={2}>
            <PatientCard selectedCardId={selectedCardId} handleCardClickhighlight={handleCardClickhighlight} w={750} patientList={slicedData} onClick={onPatientSelect} />
          </SimpleGrid>)
          :
          (
            <SimpleGrid mt={5} columns={2} spacing={2}>
              <PatientCard selectedCardId={selectedCardId} handleCardClickhighlight={handleCardClickhighlight} w={800} patientList={slicedData} onClick={onPatientSelect} />
            </SimpleGrid>
          )}
      </Box>
      <Center pb={10}>
        <MyPagination
          count={Math.ceil(data.length / pageSize)}
          page={page}
          onChange={handleChangePage}
        />
      </Center>
    </ThemeProvider>
  );
};

export default PatientList;