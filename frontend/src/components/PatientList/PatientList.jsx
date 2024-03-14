// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientCard from './PatientCard';
import { ThemeProvider, createTheme } from '@mui/material';
import MyPagination from '../Pagination/Pagination'
import LayoutSelector from '../LayoutSelector/LayoutSelector';
import { Center,SimpleGrid, Stack, Flex} from '@chakra-ui/react'; 

const PatientList = ({size}) => {
  const theme = createTheme({
    sizes: {
      container: size || '800px',
    },
  });
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSizeList = [6, 8, 10, 20, 30];
  const [pageSize, setPageSize] = useState(pageSizeList[0]);

  const [selectedLayout, setSelectedLayout] = useState('list');
  const handleLayoutChange = (layout) => {
    setSelectedLayout(layout);
    // Additional logic or state updates if needed
  };
  useEffect(() => {
    axios.get('https://raw.githubusercontent.com/thaotran0611/API/main/patient.json')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const slicedData = data.slice(startIndex, endIndex);

  const midIndex = Math.ceil(slicedData.length / 2);
  const column1 = slicedData.slice(0, midIndex);
  const column2 = slicedData.slice(midIndex);
  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Flex justifyContent="flex-end">
        <Stack direction="row" spacing="4" p="2" m='0' marginLeft="auto">
          <LayoutSelector
          onChange = {handleLayoutChange}
          selectedLayout = {selectedLayout} />
        <select className='itemPerPage' onChange={e => setPageSize(Number(e.target.value))} value={pageSize}>
            {pageSizeList.map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </Stack>
      </Flex>
        {selectedLayout === 'list' ? 
            (<SimpleGrid mt={5} columns={1} spacing={2}> 
               <PatientCard w={750} patientList={slicedData}/>
          </SimpleGrid>) 
          :(
              <SimpleGrid mt={5} columns={2} spacing={2}> 
                <PatientCard w={800} patientList={slicedData}/>
              </SimpleGrid>
        )}
          
        <Center mb={3}>
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
