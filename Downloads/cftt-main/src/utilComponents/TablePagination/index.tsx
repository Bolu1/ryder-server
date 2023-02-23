import TablePagination from '@mui/material/TablePagination';
import React, {useReducer} from 'react';
import './tablepagination.scss';

interface propsObject {
    actionEvent?: (e: React.SyntheticEvent) => any;
    className?: string;
    handleChangeRowsPerPage: (e: React.SyntheticEvent) => any;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void
    page: number;
    rowsPerPage : number;
    count: number,
  }
const Pagination = (props: propsObject):JSX.Element => {
    const {className, rowsPerPage, page, onPageChange, handleChangeRowsPerPage, count } = props;
    return(
        <div className='w-100 d-flex justify-content-center'>
            <div className="table-paginate">
                <TablePagination
                    // className="mt-4"
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </div>
    );

};
export default Pagination;