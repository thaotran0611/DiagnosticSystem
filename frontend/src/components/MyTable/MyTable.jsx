import { TableContainer, Table, Thead, Tbody, Tr, Th, Td , Box} from '@chakra-ui/react';
import { px } from 'framer-motion';
import React from 'react';

const MyTable = () => {
    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'age', header: 'Age' },
        { key: 'country', header: 'Country' },
    ];

    const data = [
        { name: 'John Doe', age: 25, country: 'USA' },
        { name: 'Jane Smith', age: 30, country: 'Canada' },
        // Add more data as needed
    ];

    return (
        <Box borderRadius="8px" overflow="hidden">

        <TableContainer width={{ base: 'full', md: '25%' }} mx="auto">
            <Table variant="simple" size="md" borderWidth="1.5px" borderColor="#A6DEF7" >
                <Thead>
                    <Tr>
                        {columns.map((column, index) => (
                            <Th
                                key={index}
                                borderBottom="1px"
                                borderColor="#A6DEF7"
                                borderRight={index === columns.length - 1 ? 'none' : '1px solid rgba(166, 222, 247, 0.5)'}
                            >
                                {column.header}
                            </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((row, rowIndex) => (
                        <Tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <Td
                                    key={colIndex}
                                    borderBottom="1px"
                                    borderColor="#A6DEF7"
                                    borderRight={colIndex === columns.length - 1 ? 'none' : '1px solid rgba(166, 222, 247, 0.5)'}
                                >
                                    {row[column.key]}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
        </Box>
    );
};

export default MyTable;
