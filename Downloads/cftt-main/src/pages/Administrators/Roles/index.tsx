import React, {useReducer, useEffect} from 'react';
import AlertComponent from 'components/AlertComponent';
import Pagination from 'utilComponents/TablePagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { GET_ALL_ROLES } from 'GraphQl/Queries';
import { useQuery } from '@apollo/client';
import { capiitalizeFirstLetter, extractErrorMessage, processAlertError } from 'utils';
import CircularLoader from 'utilComponents/Loader';
import CreateButton from 'utilComponents/CreateButton';
import { EditCircle, Eye } from 'tabler-icons-react';
import CreateRole from './CreateRole';
import EditRole from './EditRole';
import ViewRole from './ViewRole';


const Roles = ():JSX.Element => {
    const initialState = {
        listView: true,
        pagination:{
            rowsPerPage: 20,
            page:0,
            totalRecords: 20,
        },
        alertMessage:{},
        activeReportComponent: 0,
        dataArr:[], 
        isLoading:true, 
        showAllRoles: true,
        showCreateForm: false,
        showEditForm: false,
        showViewSingleRole: false,      
        activeId:null,
    };
   

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {
        listView, 
        pagination, 
        rowsPerPage, 
        isLoading, 
        alertMessage, 
        dataArr,
        showAllRoles,
        showCreateForm,
        showEditForm,
        showViewSingleRole,   
        activeId,
    } = state;
    const { fetchMore } = useQuery(GET_ALL_ROLES, {
        variables: {
            page: 0,
            limit: 20
        },
    });

    const defaultView = (refresh= null) => {
        setState({
            showAllRoles:true,
            showCreateForm: false,
            showEditForm: false,
            showViewSingleRole: false,
            activeId: null,
        });
        if(refresh){
            fetchData();
        }
    };

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
    
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const addAlert = (alertObj:{text: string, type: string}) => {
        setState({
            alertMessage: alertObj,
        });
    };

    const fetchData =  async (paginationArgs = pagination) => {
        setState({
            isLoading:true,
        });
        const apiData : any = await fetchMore({
            variables:{
                page: paginationArgs?.page + 1,
                limit: paginationArgs?.rowsPerPage
            }
        });
       
         if(apiData.data){
            setState({
                dataArr: apiData?.data?.getRoles?.docs,
                pagination:{
                    rowsPerPage: apiData?.data?.getRoles?.limit,
                    page: apiData?.data?.getRoles?.page - 1,
                    totalRecords: apiData?.data?.getRoles?.totalDocs,
                },
            }); 
        };

        if(!apiData.loading){
            setState({
                isLoading: false,
            });
        };

        if(apiData.error){
            setState({
                alertMessage : processAlertError(extractErrorMessage(apiData?.error)),
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
    }, []);

    return(
        <>
        
        {alertMessage?.text && (
            <div className=' px-2 pt-2' >
                <AlertComponent
                    text={alertMessage.text}
                    type={alertMessage.type}
                    onClose={handleAlertClose}
                />
            </div>
        )}

        {showAllRoles && (
            <>
       
                {isLoading? (
                    <>
                        <CircularLoader />
                    </>
                ):(
                        <div className="">
                            <div className="d-flex justify-content-between py-3 ">
                                <div className={`col-md-12 bg-white d-flex justify-content-between px-0 `}>
                                    <div className="py-3 px-2 w-100 overflow-auto">
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                <TableRow>
                                                    <TableCell className="table-th">#SN</TableCell>
                                                    <TableCell align="left" className="table-th">Name</TableCell>
                                                    <TableCell align="left" className="table-th">Action</TableCell>
                                                </TableRow>
                                                </TableHead>
                                                <TableBody>

                                                {dataArr.map((row:any, index: number) => (
                                                    <TableRow
                                                    //   key={row.name}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                    <TableCell component="th" scope="row">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell align="left">{capiitalizeFirstLetter(row.name)}</TableCell>
                                                    <TableCell align="left">
                                                        <div className='d-flex'>
                                                            <Eye
                                                                size={24}
                                                                strokeWidth={1.5}
                                                                color={'#0d6efd'}
                                                                className='pointer mx-3 ml-0'
                                                                onClick={()=>{
                                                                    setState({
                                                                        showAllRoles: false,
                                                                        showCreateForm: false,
                                                                        showEditForm: false,
                                                                        showViewSingleRole: true,
                                                                        activeId:row?._id,
                                                                    })
                                                                }}
                                                            />
                                                            <EditCircle
                                                                size={24}
                                                                strokeWidth={1.5}
                                                                color={'#0d6efd'}
                                                                className='pointer mx-2'
                                                                onClick={()=>{
                                                                    setState({
                                                                        activeId:row?._id,
                                                                        showEditForm:true,
                                                                        showAllRoles:false,
                                                                        showCreateForm: false,
                                                                        showViewSingleRole: false,
                                                                        
                                                                    })
                                                                }}
                                                            />
                                                            
                                                        </div>
                                                    </TableCell>
                                                    </TableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Pagination
                                            count={dataArr.length?? 0}
                                            page={0}
                                            rowsPerPage={10}
                                            onPageChange={handleChangePage}
                                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                                        />
                                    </div>
                                

                                </div>
                                
                            </div>
                            <CreateButton
                                actionEvent={()=> 
                                    setState({
                                        showAllRoles: false,
                                        showCreateForm: true,
                                        showEditForm: false,
                                        showViewSingleRole: false,
                                        activeId: null,
                                    })
                                }
                                text={'Create Role'}
                                float
                            />
                        
                    </div>

                )}
             </>
        )}
        {showCreateForm && (
            <>
                <CreateRole 
                    close={defaultView}
                    addAlert={addAlert}
                />
            </>
        )}

    {showEditForm && (
            <>
                <EditRole 
                    close={defaultView}
                    addAlert={addAlert}
                    roleId={activeId}

                />
            </>
    )}

    {showViewSingleRole && (
        <>
            <ViewRole
                close={defaultView}
                addAlert={addAlert}
                roleId={activeId}

            />
        </>
    )}
        </>
    )

};
export default Roles;