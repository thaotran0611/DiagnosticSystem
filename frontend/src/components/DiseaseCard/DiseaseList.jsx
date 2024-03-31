import React, { useState, useEffect } from 'react';
import DiseaseStatistic from './DiseaseStatistic';
import { ThemeProvider, createTheme } from '@mui/material';
import MyPagination from '../Pagination/Pagination'
import LayoutSelector from '../LayoutSelector/LayoutSelector';
import { Text, Center, SimpleGrid, Stack, Flex, Box,  Button, Spacer } from '@chakra-ui/react';
import GoToPage from '../GoToPage/GoToPage';

const data = [
    { name: 'Heart', Quantity: 200, Trend: 0.02 },
    { name: 'Lungs', Quantity: 200, Trend: -0.02 },
    { name: 'Obesity', Quantity: 200, Trend: -0.02 },
    { name: 'Depression', Quantity: 200, Trend: -0.02 },
    { name: 'Cancer', Quantity: 200, Trend: -0.02 },
    { name: 'Alcohol Abuse', Quantity: 200, Trend: 0.02 },
    { name: 'Chronic Pain', Quantity: 200, Trend: -0.02 },
    { name: 'Chronic Neurologic', Quantity: 200, Trend: 0.02 },
    { name: 'Psychiatric Disorder', Quantity: 200, Trend: 0.02 },
    { name: 'Substance Abuse', Quantity: 200, Trend: -0.02 },
];

const DiseaseList = () => {
    const theme = createTheme();

      const [page, setPage] = useState(1);
      const [error, setError] = useState(null);
      const pageSizeList = [10, 20, 30];
      const [pageSize, setPageSize] = useState(pageSizeList[0]);
      const [goToPage, setGoToPage] = useState("");
    
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
        if (pageNumber >= 1 && pageNumber <= Math.ceil(data.length / pageSize)) {
          setPage(pageNumber);
        } else {
          alert(`Page number should be between 1 and ${Math.ceil(data.length / pageSize)}`);
        }
      };
    
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const slicedData = data.slice(startIndex, endIndex);
    
      const midIndex = Math.ceil(slicedData.length / 2);
    
      if (error) {
        return <p>Error: {error.message}</p>;
      }
    
      return (
        <ThemeProvider theme={theme} >
          <Flex justifyContent="flex-end">
            <Text pl="5" pt="2" fontSize={35} fontWeight="bold" marginRight="auto">Disease List</Text>
            <Stack direction="row" spacing="4" p="2" m='0' marginLeft="auto" mr={5}>
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
          
          <Box p={5} maxHeight="330px" overflowY="auto" style={{
                scrollbarWidth: 'thin', 
                scrollbarColor: '#A0AEC0 #ffffff', 
              }}>
                <Center>

              {selectedLayout === 'list' ?
              (<SimpleGrid mt={5} columns={1} spacing={2}>
              {data.map((disease, index) => (
                <DiseaseStatistic key={index} {...disease} />
              ))}
              </SimpleGrid>)
              :
              (
                <SimpleGrid mt={5} columns={2} spacingX={40} spacingY={2}>
                  {data.map((disease, index) => (
                    <DiseaseStatistic key={index} {...disease} />
              ))}
                </SimpleGrid>
              )}
              </Center>

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

export default DiseaseList;
