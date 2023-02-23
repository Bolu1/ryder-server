import React, {useReducer, useEffect, Fragment } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_USERS_IN_BRANCH } from 'GraphQl/Queries';
import { capiitalizeFirstLetter, changeStringToLowerCase, extractErrorMessage, isNotEmptyArray, processAlertError } from 'utils';
import TableComponent from 'utilComponents/Table';
import { GROUP_MEMBERS_HEADERS } from 'constants/tableHeaders';
import {TableRow, TableCell} from '@mui/material';
import Pagination from 'utilComponents/TablePagination';

const ViewBranch = (props:any): JSX.Element => {
    const initialState = {
        isLoading: true,
        alertMessage:{},
        dataArr:[],
        activeBranch: props?.branch,
        pagination:{
            rowsPerPage: 10,
            page:0,
            totalRecords: 10,
        },
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const { isLoading, alertMessage, dataArr, pagination} = state;
    const { fetchMore } = useQuery(GET_ALL_USERS_IN_BRANCH, {
        variables: {
          branchName: capiitalizeFirstLetter(props?.branch?.name),
          page: 1,
          limit: 10,
        },
    });

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
        const newPagination = {
            ...pagination,
            page: newPage,
        };
        setState({
            page: newPage,
        });
        fetchData(newPagination);
        
    };
  
    const handleChangeRowsPerPage = (event: any): void => {
        const newPagination = {
            ...pagination,
            rowsPerPage: event?.target?.value,
        };
        
        setState({
            rowsPerPage: event?.target?.value,
        });
        fetchData(newPagination);
        
    };

    const fetchData = async(paginationArgs = pagination) => {
        try {
             
            const apiData : any =  await fetchMore({
                variables:{
                    branchName: capiitalizeFirstLetter(props?.branch?.name),
                    page: paginationArgs?.page + 1,
                    limit: paginationArgs?.rowsPerPage,
                    // flag: flag,
                }
            });
            const {data, loading, error} = apiData;
            if(data){
                setState({
                    dataArr: data?.getUsersInBranch?.docs,
                    totalRecords: data?.getUsersInBranch?.totalDocs,
                    pagination:{
                        rowsPerPage: data?.getUsersInBranch?.limit,
                        page: data?.getUsersInBranch?.page - 1,
                        totalRecords: data?.getUsersInBranch?.totalDocs,
                    },
                });
            };
            if(!loading){
                setState({
                    isLoading: false,
                });
            };
            if(error){
                setState({
                    alertMessage :processAlertError(extractErrorMessage(error)),
                });
            };
        } catch (error) {
            setState({
                alertMessage :processAlertError(extractErrorMessage(error)),
                isLoading: false,
            });
        }
    };
   
    useEffect(() => {
        fetchData();

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [props?.branch]);
 
    return(
        <>
            <TableComponent
                  
                  columns={GROUP_MEMBERS_HEADERS}
              >
                  {dataArr.map((member:any, index:number) => {
                      const {email, phone, branch} = member;
                      return(
                          <Fragment key={index}>
                              <TableRow>
                                  <TableCell>
                                      {index + 1}
                                  </TableCell>
                                  <TableCell>
                                      {member?.full_name}
                                  </TableCell>
                                  <TableCell>
                                      {email}
                                  </TableCell>
                                  <TableCell>
                                      {phone}
                                  </TableCell>
                                  <TableCell>
                                      {branch}
                                  </TableCell>
                                  <TableCell>
                                      {member?.country}
                                  </TableCell>
                                  <TableCell>
                                      {member?.status? 'Active': 'Not active'}
                                  </TableCell>
                                  
                              </TableRow>
                          </Fragment>
                      )
                  })}
              </TableComponent>
              {isNotEmptyArray(dataArr) && (
                <div>
                    <Pagination
                        count={pagination?.totalRecords}
                        page={pagination?.page}
                        rowsPerPage={pagination?.rowsPerPage}
                        onPageChange={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </div>
              )}
        </>
    )
};
export default ViewBranch;