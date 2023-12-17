import React, { useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function BasicTableRow({ rowData }) {
    return (
        <TableRow key={rowData.id}>
            <TableCell component="th" scope="row">
                {rowData.feature}
            </TableCell>
            <TableCell align="right">{rowData.type}</TableCell>
            <TableCell align="right">{rowData.size}</TableCell>
            <TableCell align="right">{rowData.describe}</TableCell>
        </TableRow>
    );
}

export default function BasicTable({ data }) {
    const memoizedRows = useMemo(() => {
        if (Array.isArray(data)) {
            return data.map((rowData) => <BasicTableRow key={rowData.id} rowData={rowData} />);
        } else {
            return null; // или другой fallback, если data не является массивом
        }
    }, [data]);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Название</TableCell>
                        <TableCell align="right">Тип</TableCell>
                        <TableCell align="right">Размер</TableCell>
                        <TableCell align="right">Описание</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{memoizedRows}</TableBody>
            </Table>
        </TableContainer>
    );
}
