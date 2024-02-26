// Import necessary dependencies
import './PatientCard.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientCard from './PatientCard';
import { Pagination, ThemeProvider, createTheme } from '@mui/material';

// Create a basic theme
const theme = createTheme();


const PatientList = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSizeList = [10, 20, 30];
  const [pageSize, setPageSize] = useState(pageSizeList[0]);

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
      <div className='PatientList'>
        <div className="two-column-layout">
            <div className="column">
              <PatientCard patientList={column1} />
            </div>
            <div className="column">
              <PatientCard patientList={column2} />
            </div>
          </div>
        <div className="pagination-container">
        <Pagination
          count={Math.ceil(data.length / pageSize)}
          page={page}
          onChange={handleChangePage}
          shape="rounded"

        />
        
        <select className='itemPerPage' onChange={e => setPageSize(Number(e.target.value))} value={pageSize}>
          {pageSizeList.map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default PatientList;
