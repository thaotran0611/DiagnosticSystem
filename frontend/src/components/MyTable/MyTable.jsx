import React, { useState, useEffect } from 'react'; 
import Box from '@mui/material/Box'; 
import { 
  DataGridPremium, 
  GridToolbar, 
  useGridApiRef, 
} from '@mui/x-data-grid-premium'; 
import { ThemeProvider, createTheme } from '@mui/material/styles'; 
import MyPagination from '../Pagination/Pagination' 
import { Stack, Flex, Center} from '@chakra-ui/react'; 

// Define custom theme 
const theme = createTheme({ 
  palette: { 
    primary: { 
      main: '#1976d2', // Change primary color 
    }, 
  }, 
}); 
 
// Custom data for the data grid 
const customData = [ 
  { id: 1, commodity: 'Apple', quantity: 10, status: 'In Stock' }, 
  { id: 2, commodity: 'Banana', quantity: 20, status: 'Out of Stock' }, 
  { id: 3, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 4, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 5, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 6, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 1, commodity: 'Apple', quantity: 10, status: 'In Stock' }, 
  { id: 2, commodity: 'Banana', quantity: 20, status: 'Out of Stock' }, 
  { id: 3, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 4, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 5, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 6, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
  { id: 7, commodity: 'Orange', quantity: 15, status: 'In Stock' }, 
 ]; 
const column = [ 
  { field: 'id', headerName: 'ID'}, 
  { field: 'commodity', headerName: 'Commodity'}, 
  { field: 'quantity', headerName: 'Quantity'}, 
  { field: 'status', headerName: 'Status'}, 
]
 
export default function MyTable() { 
  const apiRef = useGridApiRef(); 
 
  const handleSortModelChange = (newModel) => { 
    apiRef.current.setSortModel(newModel); 
  }; 
  const pageSizeList = [6, 8, 10, 20, 30]; 
  const [pageSize, setPageSize] = useState(pageSizeList[0]); 
  const [page, setPage] = useState(1); 
  const handleChangePage = (event, newPage) => { 
    setPage(newPage); 
  }; 
 
  const startIndex = (page - 1) * pageSize; 
  const endIndex = startIndex + pageSize; 
  const slicedData = customData.slice(startIndex, endIndex); 
 
  return ( 
    <ThemeProvider theme={theme}> 
    <Center> 
      <Box sx={{ height: '100%', width: '100%', border: '1px solid #ccc', borderRadius: '4px', margin: '10px' }}> 
        <DataGridPremium 
          rows={slicedData} // Pass custom data array 
          columns={column} 
          apiRef={apiRef} 
          disableRowSelectionOnClick 
          onSortModelChange={handleSortModelChange} 
          slots={{ toolbar: GridToolbar }} 
          // showCellVerticalBorder
          // showColumnVerticalBorder
          hideFooter 
      /> 
      <Flex justifyContent="flex-end">
        <Stack direction="row" spacing="4" p="2" m='0' marginLeft="auto">
          <select className='itemPerPage' onChange={e => setPageSize(Number(e.target.value))} value={pageSize}> 
            {pageSizeList.map(size => ( 
              <option key={size} value={size}> 
                Show {size} 
              </option> 
            ))} 
          </select> 
          <MyPagination 
            count={Math.ceil(customData.length / pageSize)} 
            page={page} 
            onChange={handleChangePage} 
          /> 
        </Stack>
      </Flex>
      </Box> 
    </Center>
    </ThemeProvider> 
  ); 
}

// import * as React from 'react';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import HomeIcon from '@mui/icons-material/Home';
// import {
//   DataGridPro,
//   useGridApiRef,
//   gridExpandedRowCountSelector,
//   gridVisibleColumnDefinitionsSelector,
//   gridExpandedSortedRowIdsSelector,
//   GridToolbar,
// } from '@mui/x-data-grid-pro';
// import { useDemoData } from '@mui/x-data-grid-generator';
// import { ThemeProvider, createTheme } from '@mui/material';

// const theme = createTheme();
// export default function ScrollPlayground() {
//   const apiRef = useGridApiRef();

//   const [coordinates, setCoordinates] = React.useState({
//     rowIndex: 0,
//     colIndex: 0,
//   });

//   const { data } = useDemoData({
//     dataSet: 'Commodity',
//     rowLength: 100,
//   });

//   React.useEffect(() => {
//     const { rowIndex, colIndex } = coordinates;
//     apiRef.current.scrollToIndexes(coordinates);
//     const id = gridExpandedSortedRowIdsSelector(apiRef)[rowIndex];
//     const column = gridVisibleColumnDefinitionsSelector(apiRef)[colIndex];
//     apiRef.current.setCellFocus(id, column.field);
//   }, [apiRef, coordinates]);

//   const handleClick = (position) => () => {
//     const maxRowIndex = gridExpandedRowCountSelector(apiRef) - 1;
//     const maxColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;

//     setCoordinates((coords) => {
//       switch (position) {
//         case 'top':
//           return { ...coords, rowIndex: Math.max(0, coords.rowIndex - 1) };
//         case 'bottom':
//           return { ...coords, rowIndex: Math.min(maxRowIndex, coords.rowIndex + 1) };
//         case 'left':
//           return { ...coords, colIndex: Math.max(0, coords.colIndex - 1) };
//         case 'right':
//           return { ...coords, colIndex: Math.min(maxColIndex, coords.colIndex + 1) };
//         default:
//           return { ...coords, rowIndex: 0, colIndex: 0 };
//       }
//     });
//   };

//   const handleCellClick = (params) => {
//     const rowIndex = gridExpandedSortedRowIdsSelector(apiRef).findIndex(
//       (id) => id === params.id,
//     );
//     const colIndex = gridVisibleColumnDefinitionsSelector(apiRef).findIndex(
//       (column) => column.field === params.field,
//     );
//     setCoordinates({ rowIndex, colIndex });
//   };

//   return (
//     <ThemeProvider theme={theme}>
//     <Box sx={{ width: '100%' }}>
//       <Box sx={{ width: 300, margin: '0 auto 16px' }}>
//         <Grid container justifyContent="center">
//           <Grid item>
//             <Button onClick={handleClick('top')}>top</Button>
//           </Grid>
//         </Grid>
//         <Grid container textAlign="center">
//           <Grid item xs={4}>
//             <Button onClick={handleClick('left')}>left</Button>
//           </Grid>
//           <Grid item xs={4}>
//             <IconButton
//               color="primary"
//               aria-label="home"
//               onClick={handleClick('home')}
//             >
//               <HomeIcon />
//             </IconButton>
//           </Grid>
//           <Grid item xs={4}>
//             <Button onClick={handleClick('right')}>right</Button>
//           </Grid>
//         </Grid>
//         <Grid container justifyContent="center">
//           <Grid item>
//             <Button onClick={handleClick('bottom')}>bottom</Button>
//           </Grid>
//         </Grid>
//       </Box>
//       <Box sx={{ height: 400 }}>
//         <DataGridPro
//           apiRef={apiRef}
//           onCellClick={handleCellClick}
//           {...data}
//           slots={{ toolbar: GridToolbar }}
//         />
//       </Box>
//     </Box>
//     </ThemeProvider>
//   );
// }