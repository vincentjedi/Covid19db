// TableComponent.js
import React from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const TableComponent = ({ data, show }) => {
  const renderTableHeaders = () => {
    if (data.length === 0) return null;
    
    const headers = Object.keys(data[0]);
    return headers.map((header) => (
      <TableCell key={header}>{header}</TableCell>
    ));
  };

  return (
    <>
      {show && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                {renderTableHeaders()}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((cell, idx) => (
                    <TableCell key={idx}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default TableComponent;
