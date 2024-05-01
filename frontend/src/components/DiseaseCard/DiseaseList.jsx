import React, { useState, useEffect } from 'react';
import DiseaseStatistic from './DiseaseStatistic';
import { ThemeProvider, createTheme } from '@mui/material';
import MyPagination from '../Pagination/Pagination'
import LayoutSelector from '../LayoutSelector/LayoutSelector';
import { Text, Center, SimpleGrid, Stack, Flex, Box,  Button, Spacer, Select } from '@chakra-ui/react';
import GoToPage from '../GoToPage/GoToPage';
import DrugStatistic from './DrugStatistic';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';

const DiseaseList = (props) => {
    console.log(props.diseases);
    console.log(props.drugs);
    const theme = createTheme();
    const getAllFields = (array) => {
      return array.reduce((fields, obj) => {
        Object.keys(obj).forEach(key => {
          if (!fields.includes(key)) {
            fields.push(key);
          }
        });
        return fields;
      }, []);
    }
      const [page, setPage] = useState(1);
      const [error, setError] = useState(null);
      const pageSizeList = [10, 20, 30];
      const [pageSize, setPageSize] = useState(pageSizeList[0]);
      const [goToPage, setGoToPage] = useState("");
      const [list, setList] = useState('Disease List');
      const [selectedLayout, setSelectedLayout] = useState('list');
      const handleLayoutChange = (layout) => {
        setSelectedLayout(layout);
        // Additional logic or state updates if needed
      };

      const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setGoToPage(newPage.toString()); // Update the input field when page changes
      };
      
      

      const handleGoToPage = () => {
        const pageNumber = parseInt(goToPage);
        if (list === 'Disease List') {
          if (pageNumber >= 1 && pageNumber <= Math.ceil(props.diseases.length / pageSize)) {
            setPage(pageNumber);
          } else {
            alert(`Page number should be between 1 and ${Math.ceil(props.diseases.length / pageSize)}`);
          }
        }
        else {
          if (pageNumber >= 1 && pageNumber <= Math.ceil(props.drugs.length / pageSize)) {
            setPage(pageNumber);
          } else {
            alert(`Page number should be between 1 and ${Math.ceil(props.drugs.length / pageSize)}`);
          }
        }
      };
      const [ascendding, setAscending] = useState(true);
      const [sortDiseaseby, setSortDiseaseby] = useState('no sort');
      const [sortDrugby, setSortDrugby] = useState('no sort');
      let sortResultDisease = sortDiseaseby !== 'no sort' ?  ascendding ? [...props.diseases].sort((a, b) => {
        if (sortDiseaseby === 'sum_of_male' || sortDiseaseby === 'sum_of_female') {
          return (a[sortDiseaseby]/a['sum_of_admission']).toString().localeCompare((b[sortDiseaseby]/b['sum_of_admission']).toString());
        } else if(sortDiseaseby === 'sum_of_admission'){
          return a[sortDiseaseby] - b[sortDiseaseby];
        } else {
          return a[sortDiseaseby].toString().localeCompare(b[sortDiseaseby].toString());
        }}) : [...props.diseases].sort((a, b) => {
        if (sortDiseaseby === 'sum_of_male' || sortDiseaseby === 'sum_of_female'){
          return (b[sortDiseaseby]/b['sum_of_admission']).toString().localeCompare((a[sortDiseaseby]/a['sum_of_admission']).toString());
        } else if(sortDiseaseby === 'sum_of_admission'){
          return b[sortDiseaseby] - a[sortDiseaseby];
        } else {
          return b[sortDiseaseby].toString().localeCompare(a[sortDiseaseby].toString());
        }}) : props.diseases;
      let startIndex = (page - 1) * pageSize;
      let endIndex = startIndex + pageSize;
      let slicedDisease = sortResultDisease.slice(startIndex, endIndex);
      let midIndexDisease = Math.ceil(slicedDisease.length / 2);
      let sortResultDrug = sortDrugby !== 'no sort' ?  ascendding ? [...props.drugs].sort((a, b) => {
        if (sortDrugby === 'sum_of_male' || sortDrugby === 'sum_of_female') {
          return (a[sortDrugby]/a['sum_of_admission']).toString().localeCompare((b[sortDrugby]/b['sum_of_admission']).toString());
        } else if(sortDrugby === 'sum_of_admission'){
          return a[sortDrugby] - b[sortDrugby];
        } else {
          return a[sortDrugby].toString().localeCompare(b[sortDrugby].toString());
        }}) : [...props.drugs].sort((a, b) => {
        if (sortDrugby === 'sum_of_male' || sortDrugby === 'sum_of_female'){
          return (b[sortDrugby]/b['sum_of_admission']).toString().localeCompare((a[sortDrugby]/a['sum_of_admission']).toString());
        } else if(sortDrugby === 'sum_of_admission'){
          return b[sortDrugby] - a[sortDrugby];
        } else {
          return b[sortDrugby].toString().localeCompare(a[sortDrugby].toString());
        }}) : props.drugs;
      let slicedDrug = sortResultDrug.slice(startIndex, endIndex);
      let midIndexDrug = Math.ceil(slicedDrug.length / 2);
      if (error) {
        return <p>Error: {error.message}</p>;
      }
    
      return (
        <ThemeProvider theme={theme} >
          <Flex justifyContent="flex-end">
            <Text pl="5" pt="2" fontSize={35} fontWeight="bold" marginRight="auto" variant={'outline'}>
            <select onChange={(e) => {setList(e.target.value)}}>
              <option value={'Disease List'}>Disease List</option>
              <option value={'Drug List'}>Drug List</option>
            </select>
            </Text>
            <Stack direction="row" spacing="4" p="2" m='0' marginLeft="auto" mr={5}>
                <Text paddingTop={3}>Sort:</Text>
                {list === 'Disease List' ? 
                <select paddingTop={4} onClick={(e) => {setSortDiseaseby(e.target.value)}} style={{cursor: 'pointer'}}>
                  <option value={'no sort'}>No sort</option>
                  <option value={'disease_name'}>Disease name</option>
                  <option value={'sum_of_admission'}>Number of patient</option>
                  <option value={'sum_of_male'}>Percent of male patient</option>
                  <option value={'sum_of_female'}>Percent of female patient</option>
                </select>
                  : 
                <select paddingTop={4} onClick={(e) => {setSortDrugby(e.target.value)}} style={{cursor: 'pointer'}}>
                  <option value={'no sort'}>No sort</option>
                  <option value={'drug_name_poe'}>Drug name</option>
                  <option value={'sum_of_admission'}>Number of prescription</option>
                  <option value={'sum_of_male'}>Percent of male prescription</option>
                  <option value={'sum_of_female'}>Percent of female prescription</option>
                </select>
                }
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
                    <option key={size} value={size}>
                      Show {size}
                    </option>
                  ))}
                </select>
            </Stack>
          </Flex>
          
          <Box p={5} maxHeight="300px" overflowY="auto" style={{
                scrollbarWidth: 'thin', 
                scrollbarColor: '#A0AEC0 #ffffff', 
              }}>
                <Center>

              {list === 'Disease List' ?
              selectedLayout === 'list' ?
              
              (<SimpleGrid mt={5} columns={1} spacing={2}>
              {slicedDisease.map((disease, index) => (
                <DiseaseStatistic width={'1600px'} key={index} {...disease} />
              ))}
              </SimpleGrid>)
              :
              (
                <SimpleGrid mt={5} columns={2} spacingX={20} spacingY={2}>
                  {slicedDisease.map((disease, index) => (
                    <DiseaseStatistic width={'800px'} key={index} {...disease} />
              ))}
                </SimpleGrid>
              ) : 
              selectedLayout === 'list' ? 
              (<SimpleGrid mt={5} columns={1} spacing={2}>
                {slicedDrug.map((disease, index) => (
                  <DrugStatistic width={'1600px'} key={index} {...disease} />
                ))}
                </SimpleGrid>)
              :
              (
                <SimpleGrid mt={5} columns={2} spacingX={20} spacingY={2}>
                  {slicedDrug.map((disease, index) => (
                    <DrugStatistic width={'800px'} key={index} {...disease} />
                  ))}
                </SimpleGrid>
              )
              }
              </Center>

          </Box>
          <Center pb={10}>
            <MyPagination
              count={Math.ceil((list === 'Disease List' ? props.diseases.length : props.drugs.length) / pageSize)}
              page={page}
              onChange={handleChangePage}
            />
          </Center>
        </ThemeProvider>
      );    
};

export default DiseaseList;