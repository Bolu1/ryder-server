import React, {useReducer} from 'react';
import { LayoutList } from 'tabler-icons-react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// import './tablelistview.scss';
interface propsObject {
    className?: string;
    columns: any[],
    children:JSX.Element,


  }
const TableComponent = (props: propsObject):JSX.Element => {

    const {columns, children} = props;
    return(
        <>
        
        <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                {columns.map((column, index) => (
                    <TableCell
                    key={index}
                    // align={column.align}
                    style={{ minWidth: column.minWidth }}
                    >
                    {column}
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {children}
                {/* {rows.map((row) => {
                    return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                        const value = row[column.id];
                        return (
                            <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                        );
                        })}
                    </TableRow>
                    );
                })} */}
            </TableBody>
            </Table>
        </TableContainer>
        </>
    );

};
export default TableComponent;