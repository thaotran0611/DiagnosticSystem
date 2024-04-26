import React, { useState, useEffect } from 'react';
import DiseaseStatistic from './DiseaseStatistic';
import { ThemeProvider, createTheme } from '@mui/material';
import MyPagination from '../Pagination/Pagination'
import LayoutSelector from '../LayoutSelector/LayoutSelector';
import { Text, Center, SimpleGrid, Stack, Flex, Box,  Button, Spacer, Select } from '@chakra-ui/react';
import GoToPage from '../GoToPage/GoToPage';
import DrugStatistic from './DrugStatistic';

const DiseaseList = (props) => {
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
    
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const slicedDisease = props.diseases.slice(startIndex, endIndex);
      const midIndexDisease = Math.ceil(slicedDisease.length / 2);
      const slicedDrug = props.drugs.slice(startIndex, endIndex);
      const midIndexDrug = Math.ceil(slicedDrug.length / 2);
    
      if (error) {
        return <p>Error: {error.message}</p>;
      }
    
      return (
        <ThemeProvider theme={theme} >
          <Flex justifyContent="flex-end">
            <Select onChange={(e) => {setList(e.target.value)}} 
                    pl="5" pt="2" fontSize={35} fontWeight="bold" marginRight="auto" variant={'outline'}>
              <option value={'Disease List'}>Disease List</option>
              <option value={'Drug List'}>Drug List</option>
            </Select>
            <Stack direction="row" spacing="4" p="2" m='0' marginLeft="auto" mr={5}>
                <Text paddingTop={3}>Sort:</Text>
                <select paddingTop={4}>
                  {
                    list === 'Disease List' ? 
                      <>
                        <option value={'disease_name'}>Disease name</option>
                        <option value={'sum_of_admission'}>Number of patient</option>
                        <option value={'sum_of_male'}>Number of male patient</option>
                        <option value={'sum_of_female'}>Number of female patient</option>
                      </>
                     : 
                      <>
                        <option value={'disease_name'}>Disease name</option>
                        <option value={'sum_of_admission'}>Number of patient</option>
                        <option value={'sum_of_male'}>Number of male patient</option>
                        <option value={'sum_of_female'}>Number of female patient</option>
                      </>
                  }
                </select>
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
                <DiseaseStatistic key={index} {...disease} />
              ))}
              </SimpleGrid>)
              :
              (
                <SimpleGrid mt={5} columns={2} spacingX={40} spacingY={2}>
                  {slicedDisease.map((disease, index) => (
                    <DiseaseStatistic key={index} {...disease} />
              ))}
                </SimpleGrid>
              ) : 
              selectedLayout === 'list' ? 
              (<SimpleGrid mt={5} columns={1} spacing={2}>
                {slicedDrug.map((disease, index) => (
                  <DrugStatistic key={index} {...disease} />
                ))}
                </SimpleGrid>)
              :
              (
                <SimpleGrid mt={5} columns={2} spacingX={40} spacingY={2}>
                  {slicedDrug.map((disease, index) => (
                    <DrugStatistic key={index} {...disease} />
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
